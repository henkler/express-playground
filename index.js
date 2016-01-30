var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var querystring = require('querystring');

const APP_PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname + '/public');

const GIPHY_API_KEY = 'dc6zaTOxFJmzC';

const GIPHY_API_ENDPOINT_TRENDING = 'http://api.giphy.com/v1/gifs/trending';
const GIPHY_API_ENDPOINT_SEARCH = 'http://api.giphy.com/v1/gifs/search';

search_history = [];


app.get('/', function(req,res) {
  res.sendFile(PUBLIC_DIR + '/index.html');
});

app.get('/api/imagesearch/latestsearches/', function(req, res) {
  res.json(search_history);
});

app.get('/api/imagesearch/:searchTerm', function(req, res){
  var offset;
  if (req.query.offset) {
    offset = parseInt(req.query.offset);
  }
  else {
    offset = 0;
  }
  imageSearch(req.params.searchTerm, offset, req, res);
});

function imageSearch(searchTerm, offset, req, res) {
  saveSearchHistory(searchTerm);
  var searchURL = GIPHY_API_ENDPOINT_SEARCH + '?';

  if (offset) {
    offset *= 10;
  }
  else {
    offset = 0;
  }

  searchURL += querystring.stringify({q: searchTerm, limit: "10", api_key: GIPHY_API_KEY, offset: offset});

  request(searchURL, function (error, response, body) {
    if (error) {
      res.json({ error: error });
      return;
    }
    if (response.statusCode != 200) {
      res.json({
        error: "Invalid API host response status code",
        status: response.statusCode
      });
      return;
    }

    if (!error && response.statusCode == 200) {
      var p = JSON.parse(body);

      if (p.data.length == 0) {
        res.json({
          error: "No results found"
        });
        return;
      }

      var result = [];
      for (var i = 0; i < p.data.length; i++) {
        var cur = p.data[i];
        result.push({url: cur.images.original.url, snippet: cur.slug, thumbnail: cur.images.fixed_width_small_still.url, context: cur.url, rating: cur.rating});
      }
      res.json(result);
    }
  });
}

function saveSearchHistory(searchTerm) {
  var now = new Date();
  search_history.push({term: searchTerm, when: now.toString()});

  if (search_history.length > 10) {
    search_history.shift();
  }
}

app.listen(APP_PORT);

console.log("Running at port " + APP_PORT);
