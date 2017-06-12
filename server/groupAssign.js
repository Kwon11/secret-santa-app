module.exports = function groupAssign (group_id, connection) {
  console.log('group assign got caled like this biiitch');
  //get all members from group
  //push each of their id into an array
  //random number * length, remove from array as they are chosen
  //update them on mysql database
  return new Promise ((resolve, reject) => {
    connection.query(`SELECT user_id FROM memberships WHERE group_id=${group_id} AND accepted=true`, (err, result) => {
      if (err) {
        console.log('error getting user_id from groups', err);
      }
      var members = result.map((element) => {
        return element.user_id;
      })
      var unassignedMembers = [...members];
      var assignments = {};
      for (var i = 0; i < members.length; i++) {
        console.log(unassignedMembers.length);
        var random = Math.floor(Math.random() * unassignedMembers.length);
        assignments[members[i]] = unassignedMembers[random]; //go through members, assign someone from unassigned group
        unassignedMembers.splice(random, 1);
      }
      var queryString = 'UPDATE memberships SET target_id= CASE' + queryMatchBuild(assignments);
      console.log('queryString', queryString);
      connection.query(queryString, (err, result) => {
        if (err) {
          console.log('error with assigning', err);
        }
        console.log('or success', result);
        resolve('we can pass the return value');
      })

    })

  })

}

function queryMatchBuild(assignments) {
  var returnString = ' ';
  for (var key in assignments) {
    returnString += `WHEN user_id=${key} THEN ${assignments[key]} `
  }
  returnString += 'ELSE target_id';
  returnString += ' END';
  return returnString;
}