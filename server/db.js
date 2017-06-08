function generateMemberships () {

  connection.connect((error)=> {
    if (error) {
      console.log('mysql err generateMemberships', error);
    }
    //5 groups
    //each member 3x, 6 people per group
    var records = {};
    for (var i = 1; i < 11; i++) {
      records[i] = 0;
    } //object to keep track of how many times user has been used. set to 0 each time
    console.log('records[2]', records[2]);
    
    for (var groupCounter = 1; groupCounter < 6; groupCounter++) { //go through the groups
      var groupBeingBuilt = [];
      for (var groupSize = 0; groupSize < 6; groupSize++) {
        var randomUser = Math.floor(Math.random() * 10) + 1;
        while (records[randomUser] > 5 || groupBeingBuilt.includes(randomUser)) {
          randomUser = Math.floor(Math.random()*10 + 1);
        }
        groupBeingBuilt.push(randomUser);
        connection.query(`INSERT INTO memberships (user_id, group_id, target_id, wishlist, admin) VALUES (${randomUser}, ${groupCounter}, null, ${"\"" + JSON.stringify([randomUser, groupCounter, randomUser, randomUser]) + "\""}, false)`, (err, result)=>{
          if (err) throw err;
        });
      }
    }
  
  })

}

// generateMemberships();

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

assignTargets();