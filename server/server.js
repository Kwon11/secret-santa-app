const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
var aws = require('aws-lib');
var prodAdv = aws.createProdAdvClient(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_ASSOCIATE_TAG)
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: 'secretSanta'
});
app.use(express.static(path.join(__dirname, '../dist')));


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

  //activeUser name
  //groups he belongs to
    //group name, own wishlist, target name + wishlist
    //go through both arrays and replace ASIN with item Object using amazon API
      //figure out itemLookUp

    //memberList,eventDetail in group LATER
  //res.send(initialState);
})

//in groups 2, 3, 4. targets are 7, 8, 8

      //wishlist where user_id=target_id and group_id=group_id;
      //name where id=target_id
      //own wishlist population can begin right away

var responseObject = {
  activeUser: 5,
  groups: {}
};


connection.connect((error) => {
  if (error) {
    console.log('initialstate onion', error);
  }
  connection.query(`SELECT group_id, target_id, wishlist FROM memberships WHERE user_id=${responseObject.activeUser}`, (err, result) => {
    if (err) {
      console.log('banana', err);
    }
    for (var i = 0; i < result.length; i++) {
      var wishlistQuery = (index) => {
        connection.query(`SELECT wishlist FROM memberships WHERE user_id=${result[index].target_id} AND group_id=${result[index].group_id}`, (err, wishlistResult) => {
          if (err) {
            console.log('apple', err);
          }
          if(!responseObject.groups[result[index].group_id]) {
            responseObject.groups[result[index].group_id] = {};
          }
          responseObject.groups[result[index].group_id].targetWishlist = wishlistResult[0].wishlist;
        });
      }
      var groupNameQuery = (index) => {
        connection.query(`SELECT name FROM groups WHERE id=${result[index].group_id}`, (err, groupNameResult) => {
          console.log('groupnameResult for', index, groupNameResult[0].name)
          if (err) {
            console.log('apple', err);
          }
          if(!responseObject.groups[result[index].group_id]) {
            responseObject.groups[result[index].group_id] = {};
          }
          responseObject.groups[result[index].group_id].groupName = groupNameResult[0].name;
        })
      }
      var targetNameQuery = (index) => {
        connection.query(`SELECT name FROM users WHERE id=${result[index].target_id}`, (err, targetNameResult) => {
          console.log('targetNameResult for', index, targetNameResult[0].name)
          if (err) {
            console.log('apple', err);
          }
          if(!responseObject.groups[result[index].group_id]) {
            responseObject.groups[result[index].group_id] = {};
          }
          responseObject.groups[result[index].group_id].targetName = targetNameResult[0].name;
        })
      }
      targetNameQuery(i);
      groupNameQuery(i);
      wishlistQuery(i);
    }
  })
})

setTimeout(() => console.log(responseObject), 5000);


app.listen(3000, () => {
  console.log('express server is going 3000');
})