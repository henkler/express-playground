var express = require('express');
var app = express();
var path = require('path');

const APP_PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname + '/public');

app.get('/', function(req,res) {
  res.sendFile(PUBLIC_DIR + '/index.html');
});

app.get('/new/:href(*)', function(req,res) {
  var href = req.params.href;

  if (!isValidURL(href)) {
    res.send({"error": "URL invalid"});
  }

  res.send({"original_url": href, "short_url": createShortenedURL(href, req)});
});

app.get('/:index(\\d+)', function(req,res) {
  var index = parseInt(req.params.index);
  var shortURL = getShortenedURL(index);
  if (shortURL) {
    res.redirect(shortURL);
  }
  else {
    res.status(404).send('Short URL not found');
  }
});

app.get('*', function(req,res) {
  res.status(404).send('Invalid short URL');
});

app.listen(APP_PORT);

console.log("Running at port " + APP_PORT);

var nextIndex = 1;
var urlMapByIndex = {};
var urlMapByURL = {};

function createShortenedURL(url, req) {
  var shortenedURL = req.protocol + '://' + req.get('host');
  // if we've already created this short URL, return it
  if (urlMapByURL[url]) {
    shortenedURL += "/" + urlMapByURL[url];
  }
  else {
    shortenedURL += "/" + nextIndex;
    urlMapByIndex[nextIndex] = url;
    urlMapByURL[url] = nextIndex;
    nextIndex++;
  }

  return shortenedURL;
}

function getShortenedURL(index) {
  if (urlMapByIndex[index]) {
    return urlMapByIndex[index];
  }
  else {
    return null
  }
}

//
// Regular Expression for URL validation
//
// Author: Diego Perini
// Updated: 2010/12/05
// License: MIT
// https://gist.github.com/dperini/729294
function isValidURL(url) {
  var urlTest = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return urlTest.test(url);
}
