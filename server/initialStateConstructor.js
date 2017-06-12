var connection = require('./db.js');
var prodAdv = require('./awsAPI.js');

var firstCallPromise = function (activeUser) {
  return new Promise ((resolve, reject) => {
      connection.query(`SELECT group_id, target_id, wishlist, accepted, admin FROM memberships WHERE user_id=${activeUser}`, (err, result) => {
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
            if (data[i].accepted === 1) {
              console.log('targetwishlistcall line 59 goes true')
              amazonBatchCall(i);
            } else {
              counter++;
              userWishlistData.push({
                group_id: data[i].group_id,
                wishlist: 'Wishlist not yet built or targets not yet assigned!'
              })
              if (counter === complete) {
                  resolve(userWishlistData);
              }
            }
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
        connection.query(`SELECT wishlist,accepted FROM memberships WHERE user_id=${data[index].target_id} AND group_id=${data[index].group_id}`, (err, result) => {
          counter++;
          if (err) {
            console.log('err', err);
          }
          console.log('line 99 result', result);
          wishlistObject.push({
            group_id: data[index].group_id,
            wishlist: result[0].wishlist,
            accepted: data[index].accepted
          })
          if (counter === complete) {
            resolve(wishlistObject);
          }
        })
      }
      if (data[i].target_id) {
        x(i, data);
      } else {
        counter++;
        wishlistObject.push({
          group_id: data[i].group_id,
          wishlist: 'Targets not yet assigned!',
          accepted: false
        })
        if (counter === complete) {
            resolve(wishlistObject);
        }
      }
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
        console.log('amazonbatchcalled for ', index, data[index].wishlist);
        var options = {

          ResponseGroup: 'OfferSummary, ItemAttributes, Images',
          ItemId: data[index].wishlist
        }
        prodAdv.call("ItemLookup", options, (err, result) => {
          counter++;
          if (err) {
            console.log('err with index', index, err);
            reject(err);
          }
          userWishlistData.push({
            group_id: data[index].group_id,
            wishlist: result.Items.Item
          })
          if (counter === complete) {
            console.log('userwishlist data for', index, userWishlistData);
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
            groupName: result[0].name,
            accepted: data[index].accepted,
            admin: data[index].admin
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
      if (data[i].target_id !== null && data[i].target_id !== undefined) {
        x(i);
      } else {
        counter++;
        targetNameArray.push({
          group_id: data[i].group_id,
          target_id: null,
          targetName: 'Targets not yet assigned!'
        })
        if (counter === complete) {
            resolve(targetNameArray);
        }
      }
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

module.exports = mainCall;