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

module.exports = connection;