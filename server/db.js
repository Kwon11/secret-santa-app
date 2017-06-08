// Run to generate fake data
var queryArray = [];
var membershipGenerator = function () {
  var membership = {};
  for (var groupID = 1; groupID <= 5; groupID++) { //groups 1 - 5
      for (var b = 0; b < 6; b++) {
        var randomUser = Math.floor(Math.random() * 10) + 1;
        var counter = 0;
        while (membership.randomUser >= 3 && counter < 500) {
          randomUser === Math.floor(Math.random() * 10) + 1;
          counter++;
        }
        queryArray.push([randomUser, groupID, false, [randomUser, groupID, randomUser, randomUser, randomUser, ]]);
      } //6 times for each
  } //groups 1 - 5
}
membershipGenerator();

connection.connect((error) => {
  if (error) throw error;
  var youngMoney = 0;
  function queryThenCallNext (paramsArray) {
    connection.query(`INSERT INTO memberships (user_id, group_id, admin, wish_list) VALUES (${paramsArray[0]}, ${paramsArray[1]}, ${paramsArray[2]}, ${ "\"" + JSON.stringify(paramsArray[3]) + "\"" })`, function(err, result) {
      if (err) {
        console.log('error during queryThencallNext', youngMoney);
      }
      if (youngMoney < queryArray.length) {
        youngMoney++;
        queryThenCallNext(queryArray[youngMoney]);
      }
    })
  }
  queryThenCallNext(queryArray[0]);
  console.log('done');
})
