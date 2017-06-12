require('dotenv').config();
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

var counter = 1, total = 5;

var recurse = (index) => {
  connection.query(`UPDATE groups SET location=${index}, date_assign=${index + index + index}, date_due=${index + index + index } WHERE id=${index}`, (error, result) => {
    if (error) {
      console.log(error);
    }
    console.log('recursed', counter)
    counter++;
    if (counter < total) {
      recurse(counter);
    }
  })
}
