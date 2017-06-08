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

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/EditList', (req, res) => {
  //hard code who the "user" is for now
  //query database for all values related to that user, construct initial state on this server -- worry about lazy loading later
  var activeUser = 2;
  console.log('get request');
  connection.connect((error)=> {
    if (error) {
      console.log ('error connecting to MySQL', error);
      res.sendStatus(200);
    }
    //get the user's name
    connection.query(`select name from users where id=${activeUser}`, (err, result) => {
      if (err) throw err;
      console.log('result of database query', result[0].name);
      connection.query('select group_id, target_id ')//GET BACK TO WORK HERE
    })
    //get all the groups he is a part of
    //for each group
      //get group name
      //get target
      //get target wish_list
      //get user's wish_list
    //build out that data.initialstate and send back

  })
  
})

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
