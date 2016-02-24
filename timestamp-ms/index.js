var express = require('express');
var app = express();
var path = require('path');
var moment = require('moment');

const APP_PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname + '/public');

const DATE_FORMAT_NATURAL = "MMMM D, YYYY";
const DATE_FORMAT_UNIX = "X";

app.get('/', function(req,res) {
  res.sendFile(PUBLIC_DIR + '/index.html');
});

app.get('/:date', function(req,res) {
  var path = req.params.date;
  var date;
  // if this is a unix timestamp
  if (/^\d+$/.test(path)) {
    console.log(Number(path));
    date = moment.unix(Number(path));
  }
  else {
    if (moment(path, DATE_FORMAT_NATURAL).isValid()) {
      date = moment(path, DATE_FORMAT_NATURAL);
    }
  }
  res.send(dateResponse(date));
});

function dateResponse(date) {
  var unixTimestamp = null;
  var naturalTimestamp = null;

  if (date) {
    unixTimestamp = moment(date).format(DATE_FORMAT_UNIX);
    naturalTimestamp = moment(date).format(DATE_FORMAT_NATURAL);
  }

  return {
    "unix": unixTimestamp,
    "natural": naturalTimestamp
  }
}

app.listen(APP_PORT);

console.log("Running at port " + APP_PORT);
