const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
var aws = require('aws-lib');

var prodAdv = aws.createProdAdvClient(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_ASSOCIATE_TAG)



app.use(express.static(path.join(__dirname, '../dist')));

app.get('/test', (req, res) => {

  var options = {SearchIndex: "Books", Keywords: "Javascript"}

  prodAdv.call("ItemSearch", options, function(err, result) {
    console.log(result);
    res.send(result);
  })

})


app.listen(3000, () => {
  console.log('express server is going 3000');
})

//basic servering static files
//a route that handles group specific data
