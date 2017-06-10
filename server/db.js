function generateMemberships () {
  connection.connect((error)=> {
    if (error) {
      console.log('mysql err generateMemberships', error);
    }
    var records = {}; //object to keep track of how many times user has been used  
    for (var i = 1; i < 11; i++) {
      records[i] = 0;
    } 

    for (var groupCounter = 1; groupCounter < 6; groupCounter++) { 
      var groupBeingBuilt = [];
      for (var groupSize = 0; groupSize < 6; groupSize++) {
        var randomUser = Math.floor(Math.random() * 10) + 1;
        while (records[randomUser] > 5 || groupBeingBuilt.includes(randomUser)) {
          randomUser = Math.floor(Math.random()*10 + 1);
        }
        groupBeingBuilt.push(randomUser);
        connection.query(`INSERT INTO memberships (user_id, group_id, target_id, wishlist, admin) VALUES (${randomUser}, ${groupCounter}, null, ${JSON.stringify(randomUser)}, false)`, (err, result)=>{
          if (err) throw err;
        });
      }
    }
  })
}

function assignTargets () {
  connection.connect((error) => {
    for (var abc = 1; abc < 6; abc++ ) {
      function asyncFixerHack (groupCounter) {
        connection.query(`SELECT user_id FROM memberships WHERE group_id=${groupCounter}`, (err, result) => {

          var groupMembers = [];
          for (var i = 0; i < result.length; i++) {
            groupMembers.push(result[i].user_id);
          }
          console.log(`group ${groupCounter}`, groupMembers);
          var j = 0;
          function queryThenCallNext (index, group, groupId) {
            var target = index + 1;
            if (target === (group.length)) {
              target = 0;
            }
            connection.query(`UPDATE memberships SET target_id = ${group[target]} WHERE user_id = ${group[index]} AND group_id = ${groupId};`, (err, result) => {
                console.log(`UPDATE memberships SET target_id = ${group[target]} WHERE user_id = ${group[index]} AND group_id = ${groupId};`)
                if (err) throw err;
                // console.log(`added ${groupMembers[target]} as a target for ${groupMembers[index]} in group ${groupCounter} index=${index}`)
                if (j < group.length - 1) {
                  j++;
                  queryThenCallNext(j, group, groupId);
                }
              })
          }
          queryThenCallNext(0, groupMembers, groupCounter);
          
        })
      }
      asyncFixerHack(abc);
    }
  })
}

connection.connect((error) => {
  if (error) {
    console.log('connecting error A', error)
  }

  connection.query('select user_id, group_id from memberships', (err, membershipResult) => {
    if (err) {
      throw err;
    }
    console.log('queried for memberships', membershipResult);

    function updateListThenCallNext (index) {

      var options = {
        SearchIndex: 'All',
        ResponseGroup: 'OfferSummary, ItemAttributes, Images',
        Keywords: searchTerms[index]
      }
      var wishList;
      prodAdv.call("ItemSearch", options, function(err, result) {
        if (err) {
          console.log('error with amazon', err);
        }
        
        wishList = result.Items.Item.map((element) => {
          return element.ASIN;
        })
        var wishListString = "";
        for (var wishListCounter = 0; wishListCounter < wishList.length; wishListCounter++) {
          wishListString += wishList[wishListCounter];
          if (wishListCounter !== wishList.length-1) {
            wishListString += ",";
          }
        }
        wishListString = "\"" + wishListString + "\""
        console.log('wishListString:', wishListString)
        var thanos = `UPDATE memberships SET wishlist=${wishListString} WHERE user_id=${membershipResult[index].user_id} AND group_id=${membershipResult[index].group_id}`;
        connection.query(thanos, (err, result) => {
          if (index % 3 === 0) {
            console.log(thanos, index);
          }
          if (err) {
            throw err;
          }
          if (index < 29) {
            updateListThenCallNext(index+1); 
          }
        })  
      })

    }
    updateListThenCallNext(0);

  }) 

})

var searchTerms = ["javascript", "mustang", "mug", "coffee", "fertilizer", "caffeine", "scissors", "chairs", "baseball", "depression", "trigger", "oranges", "superman", "marijuana", "java", "halo", "smallville", "suits", "simpsons", "digimon", "samurai", "ninja", "pirate", "santa", "southpark", "water", "cable", "samsung", "sony", "navajo", "jabroni"];
