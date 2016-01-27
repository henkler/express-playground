var express = require('express');
var app = express();
var path = require('path');

const APP_PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname + '/public');

app.get('/', function(req,res) {
  res.sendFile(PUBLIC_DIR + '/index.html');
});

app.listen(APP_PORT);

console.log("Running at port " + APP_PORT);
