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
  password: 'secretSanta69',
  database: 'secretSanta'
});
/*
connection.connect((error) => {
  if (error) {
    console.log('error connecting to MySQL', error);
  }
  connection.query('CREATE TABLE test(id int primary key auto_increment, name varchar(255), age int, address text)', function(err, result) {
    if (err) throw err
    connection.query('INSERT INTO test (name, age, address) VALUES (?, ?, ?)', ['Larry', '41', 'California, USA'], function(err, result) {
      if (err) throw err
      connection.query('SELECT * FROM test', function(err, results) {
        if (err) throw err
      })
    })
  }) 
})
*/


app.use(express.static(path.join(__dirname, '../dist')));

app.get('/test', (req, res) => {
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


app.listen(3000, () => {
  console.log('express server is going 3000');
})

//basic servering static files
//a route that handles group specific data
