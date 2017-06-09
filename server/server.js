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
  //active user => [group_id, target_id, wishlist]
    //groud_id => group_name => BUILDSTATE
    //target_id + group_id => targetlist => amazonApi => BUILDSTATE
    //target_id => target.name => BUILDSTATE
    //wishlist => amazonApi => BUILDSTATE
  //
})

//in groups 2, 3, 4. targets are 7, 8, 8
      //wishlist where user_id=target_id and group_id=group_id;
      //name where id=target_id
      //own wishlist population can begin right away


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
    // groupNamesPromise = groupNamesCall(firstData),
    // targetNamesPromise = targetNamesCall(firstData)
    targetWishlistsPromise = targetWishlistsCall(firstData);
  return Promise.all([userNamePromise, userWishlistsPromise, targetWishlistsPromise]);
      //values = [[userWishlist, userWishlist], [groupName, groupName], [targetName, targetName], [targetWishlist, targetWishlist]]
  //3 promises that resolve to [target_names] [group_names] [convertedselfLIst]
  //1 wrapper(parentResolve) promise that has: 1 promise that resolves to [target_list] =>  
}

var userNameCall = function (user_id) {
  return new Promise ((resolve, reject) => {
    connection.query(`SELECT name FROM users WHERE id=${user_id}`, (err, result) => {
      if (err) {
        reject(err);
      }
      console.log('userNameCall result[0].group_name:', result[0].name);
      resolve(result[0].name);
    })
  })
}

var userWishlistsCall = function (data) {
  //data[i].wishlist is a string with spaces
  //go through each one, turn it into an array
  //pass an object {group_id: [wishlist.toArray()], group_id:...} to wishlistCall
  //get back an object with keys: wishlistOfItemObjects. Use to write onto data object
  var groupsAndWishlists = {};
  data.map((element) => {
    element.wishlist = element.wishlist.trim();
    groupsAndWishlists[element.group_id] = element.wishlist.split(/\s/);
  })
  // console.log(groupsAndWishlists);
  //return wishlistCall(groupsAndWishlists)
}

var groupNamesCall = function (data) {
  
}

var targetNamesCall = function (data) {
  
}

var targetWishlistsCall = function (data) {
  //finds target_lists for each target_id + group_id
  //return promise from wishlistCall on that ^
  // console.log('targetwish gets called');
  var asyncCounter = 0, completeness = data.length;
  var groupsAndWishlists = {};
  for (var i = 0; i < data.length; i++) {
    var queryCall = (index) => {
      connection.query(`SELECT wishlist FROM memberships WHERE user_id=${data[index].target_id} AND group_id=${data[index].group_id}`, (err, result) => {
        if (err) {
          throw err;
        }
        asyncCounter++;
        groupsAndWishlists[data[index].group_id] = result[0].wishlist;
        if (asyncCounter === completeness) {
          for (var key in groupsAndWishlists) {
            groupsAndWishlists[key] = groupsAndWishlists[key].trim().split(/\s/);
          }
          // console.log('from targetWishcall', groupsAndWishlists);
          return wishlistCall(groupsAndWishlists);
        }
      })
    }
    queryCall(i);
  }
}

var wishlistCall = function (data) {
  //this has to return a promise {key: object}
  var convertedListData = {};
  for (var key in data) {
    
    asyncAmazon(key, 0, data[key].length);
  }

  var asyncAmazon = (group_id, asyncCounter, total) => {
    var options = {
      ItemId: data[group_id][asyncCounter],
      ResponseGroup: 'OfferSummary, ItemAttributes, Images' 
    }
    prodAdv.call("ItemLookup", options, (err, result) => {
      asyncCounter++;
      if (!convertedListData[group_id]) {
        convertedListData[group_id] = [];
      }
      convertedListData[group_id].push(result.Item.items);
    })
  }


}

//firstData = [{} {} {}]
var mainCall = function (activeUser) {
  firstCallPromise(activeUser) //queries for group_id, target_id, wishlist
    .then((firstData) => secondCallPromise(firstData, activeUser))             //uses those to get groupNames, targetnames, targetwishlists, selfwishlist
    .then((values) => {           //use those to write to the initialData
      //construct state with all the values, then return that out of mainCall();
    })
}

var test = mainCall(5);

app.listen(3000, () => {
  console.log('express server is going 3000');
})