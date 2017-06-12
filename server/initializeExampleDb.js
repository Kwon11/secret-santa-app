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

//make 5 groups
//make 10 users
  //each user in 3 groups means 6 people per group
//run assign on each group 1 - 5