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

})



var firstCallPromise = function (activeUser) {
  return new Promise ((resolve, reject) => {
    connection.connect(error => {
      if (error) {
        reject(error);
      }
      connection.query(`SELECT group_id, target_id, wishlist FROM memberships WHERE user_id=${activeUser}`, (err, result) => {
        resolve(result);
      })
    })
  });
}

var secondCallPromise = function (firstData, activeUser) { //returns a promise.all
  var userNamePromise = userNameCall(activeUser),
    userWishlistsPromise = userWishlistsCall(firstData),
    groupNamesPromise = groupNamesCall(firstData),
    // targetNamesPromise = targetNamesCall(firstData)
    targetWishlistsPromise = targetWishlistsCall(firstData);
  return Promise.all([userNamePromise, userWishlistsPromise, groupNamesPromise, targetWishlistsPromise]); 
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
          var userWishlistData = {};
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
                userWishlistData[data[index].group_id] = result.Items.Item;
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
function convertToWishlist(data) {
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

var userWishlistsCall = function (data) {
  return new Promise ((resolve, reject) => {
    var complete = data.length;
    var userWishlistData = {};
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
          userWishlistData[data[index].group_id] = result.Items.Item;
          if (counter === complete) {
            resolve(userWishlistData);
          }
        })
      }
      amazonBatchCall(i);
    }
  })
}

var groupNamesCall = function (data) {
  var groupNameArray = [];
  return new Promise ((resolve, reject) => {
    //get all the group names, pair them with group_id;
    var counter = 0, complete = data.length;
    for (var i = 0; i < data.length; i++) {
      var x = (index) => {
        connection.query(`SELECT name FROM groups WHERE id=${data[index].group_id}`, (err, result) => {
          counter++;
          if (err) {
            console.log('err 171', err);
          }
          groupNameArray.push({
            group_id: data[index].group_id,
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

var targetNamesCall = function (data) {
  
}


//firstData = [{} {} {}]
var mainCall = function (activeUser) {
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


var test = mainCall(5);
test.then((res) => {
  console.log('test resolves to', res);
})

app.listen(3000, () => {
  console.log('express server is going 3000');
})