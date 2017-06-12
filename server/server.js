const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
var bodyParser = require('body-parser');
var connection = require('./db.js');
var mainCall = require('./initialStateConstructor.js');
var groupAssign = require('./groupAssign.js');
var prodAdv = require('./awsAPI.js');

app.use(express.static(path.join(__dirname, '../dist')));
app.use(bodyParser.json())

app.get('/Test', (req, res) => {
  console.log(req.query.keywords);
  var options = {
    SearchIndex: 'All',
    ResponseGroup: 'OfferSummary, ItemAttributes, Images',
    Keywords: req.query.keywords
  }
  prodAdv.call("ItemSearch", options, function(err, result) {
    res.send(result);
  })
})

app.get('/InitialState', (req, res) => {
  var activeUser = 5;
  mainCall(activeUser)
    .then((result) => {
      //[0 -- username, 1 -- [{group_id and groupName}], 2 -- [{group_id, target_id, targetName}], 3 -- [{group_id: group_id, wishlist: []}] userWishLIst],  4 --[same but for target]]
      console.log('data from maincall', result);
      var initialState = {};
      initialState.activeUser = result[0];
      initialState.activeUserId = activeUser;
      initialState.groups = {};
      for (var i = 0; i < result[1].length; i++) {
        initialState.groups[result[1][i].group_id] = {
          groupname: result[1][i].groupName,
          location: result[1][i].location,
          date_assign: result[1][i].date_assign,
          date_due: result[1][i].date_due
        }
      } 
      for (var i = 0; i < result[1].length; i++) {
        initialState.groups[result[2][i].group_id].targetName = result[2][i].targetName;
        initialState.groups[result[2][i].group_id].target_id = result[2][i].target_id;
        initialState.groups[result[3][i].group_id].userWishlist = result[3][i].wishlist;
        initialState.groups[result[4][i].group_id].targetWishlist = result[4][i].wishlist

      }
      console.log('final initialstate', initialState);
      res.send(initialState);
    }) 
})

app.post('/ADD', (req, res) => {
  console.log('got post to add', req.body);
  connection.query(`SELECT wishlist FROM memberships WHERE user_id=${req.body.user_id} AND group_id=${req.body.group_id}`,(error, result) => {
    if (error) {
      console.log('error with add', error);
      res.sendStatus(200)
    }
    console.log('result from pt1', result);
    if (result[0].wishlist.length === 0) {
      var newWishlist = result[0].wishlist + `${req.body.item_id}`;  
    } else {
      var newWishlist = result[0].wishlist + `,${req.body.item_id}`;
    }
    connection.query(`UPDATE memberships SET wishlist = '${newWishlist}' WHERE user_id=${req.body.user_id} AND group_id=${req.body.group_id}`, (err, result2) => {
      if (err) {
        console.log('error with add2', err)
      }
      console.log('result from pt2', result2);
      connection.query(`SELECT wishlist FROM memberships WHERE user_id=${req.body.user_id} AND group_id=${req.body.group_id}`, (err, result3) => {
        if (err) {
          console.log('error with add3', err)
        }
        var options = {
          ResponseGroup: 'OfferSummary, ItemAttributes, Images',
          ItemId: result3[0].wishlist
        }
        prodAdv.call("ItemLookup", options, (err, result) => {
          if (err) {
            reject(err);
          }
          res.send({
            group_id: req.body.group_id,
            wishlist: result.Items.Item
          })
        })
      })
    })

  })
})

app.post('/REMOVE', (req, res) => {
  console.log('REMOVE gets', req.body)
    connection.query(`SELECT wishlist FROM memberships WHERE user_id=${req.body.user_id} AND group_id=${req.body.group_id}`,(error, result) => {
    if (error) {
      console.log('error with add', error);
      res.sendStatus(200)
    }
    console.log('result from pt1', result);

    var newWishlist = result[0].wishlist.replace(`${req.body.item_id},`,'');
    newWishlist = newWishlist.replace(`${req.body.item_id}`,'');//this is the only step that is different

    connection.query(`UPDATE memberships SET wishlist = '${newWishlist}' WHERE user_id=${req.body.user_id} AND group_id=${req.body.group_id}`, (err, result2) => {
      if (err) {
        console.log('error with add2', err)
      }
      console.log('result from pt2', result2);
      connection.query(`SELECT wishlist FROM memberships WHERE user_id=${req.body.user_id} AND group_id=${req.body.group_id}`, (err, result3) => {
        if (err) {
          console.log('error with add3', err)
        }
        var options = {
          ResponseGroup: 'OfferSummary, ItemAttributes, Images',
          ItemId: result3[0].wishlist
        }
        prodAdv.call("ItemLookup", options, (err, result) => {
          if (err) {
            reject(err);
          }
          res.send({
            group_id: req.body.group_id,
            wishlist: result.Items.Item
          })
        })
      })
    })
  })
})

app.post('/ASSIGN', (req, res) => {
  console.log('req.body', req.body);
  var targetGroup = req.body.group_id;
  var serverSide = groupAssign(targetGroup, connection);
  serverSide.then((res) => {
    console.log('serverSide', res);
  })
  res.sendStatus(100);
})

app.listen(3000, () => {
  console.log('express server is going 3000');
})