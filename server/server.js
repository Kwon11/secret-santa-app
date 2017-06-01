var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  res.status(100);
})

app.listen(3000, () => {
  console.log('express server is going 3000');
})

//basic servering static files
//a route that handles group specific data
