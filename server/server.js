const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
var bodyParser = require('body-parser');
var aws = require('aws-lib');
var prodAdv = aws.createProdAdvClient(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_ASSOCIATE_TAG)
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: 'secretSanta'
});
connection.connect(error => {
  if (error) {
    console.log('error connecting mysql', error);
  } else {
    console.log('connected mysql');
  }
});
var groupAssign = require('./groupAssign.js');

var firstCallPromise = function (activeUser) {
  return new Promise ((resolve, reject) => {
      connection.query(`SELECT group_id, target_id, wishlist FROM memberships WHERE user_id=${activeUser}`, (err, result) => {
        resolve(result);
      })
  });
}
var secondCallPromise = function (firstData, activeUser) { //returns a promise.all
  var userNamePromise = userNameCall(activeUser),
    userWishlistsPromise = userWishlistsCall(firstData),
    groupNamesPromise = groupNamesCall(firstData),
    targetNamesPromise = targetNamesCall(firstData),
    targetWishlistsPromise = targetWishlistsCall(firstData);
  return Promise.all([userNamePromise, groupNamesPromise, targetNamesPromise, userWishlistsPromise, targetWishlistsPromise]); 
}
var userNameCall = function (user_id) {
  return new Promise ((resolve, reject) => {
    connection.query(`SELECT name FROM users WHERE id=${user_id}`, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result[0].name);
    })
  })
}
var targetWishlistsCall = function (data) {
  return convertToWishlist(data)
    .then((data) => {
        return new Promise ((resolve, reject) => {
          var complete = data.length;
          var userWishlistData = [];
          var counter = 0;
          for (var i = 0; i < data.length; i++) {
            function amazonBatchCall (index) {
              var options = {

                ResponseGroup: 'OfferSummary, ItemAttributes, Images',
                ItemId: data[index].wishlist
              }
              prodAdv.call("ItemLookup", options, (err, result) => {
                counter++;
                if (err) {
                  console.log(err);
                  reject(err);
                }
                userWishlistData.push({
                  group_id: data[index].group_id,
                  wishlist: result.Items.Item
                })
                if (counter === complete) {
                  resolve(userWishlistData);
                }
              })
            }
            amazonBatchCall(i);
          }
        })
    })
    .catch((err) => {
      console.log('error', err);
    })
}
var convertToWishlist = (data) => {
  //we get the firstData object, we want to return an array of objects with group_id and wishlist-target
  //for each element [i] of data, find the wishlist from group_id/target_id
  return new Promise ((resolve, reject) => {
    var counter = 0, complete = data.length;
    var wishlistObject = [];
    for (var i = 0; i < data.length; i++) {
      var x = (index, data) => {
        connection.query(`SELECT wishlist FROM memberships WHERE user_id=${data[index].target_id} AND group_id=${data[index].group_id}`, (err, result) => {
          counter++;
          if (err) {
            console.log('err', err);
          }
          wishlistObject.push({
            group_id: data[index].group_id,
            wishlist: result[0].wishlist
          })
          if (counter === complete) {
            resolve(wishlistObject);
          }
        })
      }
      x(i, data);
    }    
  })
}
var userWishlistsCall = (data) => {
  return new Promise ((resolve, reject) => {
    var complete = data.length;
    var userWishlistData = [];
    var counter = 0;
    for (var i = 0; i < data.length; i++) {
      function amazonBatchCall (index) {
        var options = {

          ResponseGroup: 'OfferSummary, ItemAttributes, Images',
          ItemId: data[index].wishlist
        }
        prodAdv.call("ItemLookup", options, (err, result) => {
          counter++;
          if (err) {
            reject(err);
          }
          userWishlistData.push({
            group_id: data[index].group_id,
            wishlist: result.Items.Item
          })
          if (counter === complete) {
            resolve(userWishlistData);
          }
        })
      }
      amazonBatchCall(i);
    }
  })
}
var groupNamesCall = (data) => {
  var groupNameArray = [];
  return new Promise ((resolve, reject) => {
    //get all the group names, pair them with group_id;
    var counter = 0, complete = data.length;
    for (var i = 0; i < data.length; i++) {
      var x = (index) => {
        connection.query(`SELECT name, location, date_assign, date_due FROM groups WHERE id=${data[index].group_id}`, (err, result) => {
          counter++;
          if (err) {
            console.log('err 171', err);
          }
          groupNameArray.push({
            group_id: data[index].group_id,
            location: result[0].location,
            date_assign: result[0].date_assign,
            date_due: result[0].date_due,
            groupName: result[0].name
          })
          if (counter === complete) {
            resolve(groupNameArray);
          }
        })
        
      }
      x(i);
    }
  })
}
var targetNamesCall = (data) => {
  var targetNameArray = [];
  return new Promise ((resolve, reject) => {
    //get all the group names, pair them with group_id;
    var counter = 0, complete = data.length;
    for (var i = 0; i < data.length; i++) {
      var x = (index) => {
        connection.query(`SELECT name FROM users WHERE id=${data[index].target_id}`, (err, result) => {
          counter++;
          if (err) {
            console.log('err 171', err);
          }
          targetNameArray.push({
            group_id: data[index].group_id, //so its easy to insert into initialState
            target_id: data[index].target_id,
            targetName: result[0].name
          })
          if (counter === complete) {
            resolve(targetNameArray);
          }
        })
        
      }
      x(i);
    }
  })  
}
var mainCall = (activeUser) => {
  return firstCallPromise(activeUser) //queries for group_id, target_id, wishlist
    .then((firstData) => secondCallPromise(firstData, activeUser))             //uses those to get groupNames, targetnames, targetwishlists, selfwishlist
    .then((values) => {           //use those to write to the initialData
      //construct state with all the values, then return that out of mainCall();
      return values;
    })
    .catch((err) => {
      console.log('error maincall', err);
    })
}


// var test = mainCall(5);

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
      //construct here, then send result
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
      } //now it has groupName
      //now it has target_id and targetName in each group
      for (var i = 0; i < result[1].length; i++) {
        initialState.groups[result[2][i].group_id].targetName = result[2][i].targetName;
        initialState.groups[result[2][i].group_id].target_id = result[2][i].target_id;
        initialState.groups[result[3][i].group_id].userWishlist = result[3][i].wishlist;
        initialState.groups[result[4][i].group_id].targetWishlist = result[4][i].wishlist

      }
      console.log('final initialstate', initialState);
      res.send(initialState);
    }) //BUILD THE STATE AND SERVE
    /*{
      activeUser: "username",
      groups: {
        452: {
          groupName: 'school'
        }
      }
    }*/
})

app.post('/ADD', (req, res) => {
  console.log('got post to add', req.body);
  connection.query(`SELECT wishlist FROM memberships WHERE user_id=${req.body.user_id} AND group_id=${req.body.group_id}`,(error, result) => {
    if (error) {
      console.log('error with add', error);
      res.sendStatus(200)
    }
    console.log('result from pt1', result);
    var newWishlist = result[0].wishlist + `,${req.body.item_id}`;
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