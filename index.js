var express = require('express');
var app = express();
var path = require('path');

const APP_PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname + '/public');

app.get('/', function(req,res) {
  res.sendFile(PUBLIC_DIR + '/index.html');
});

app.get('/api/whoami', function(req, res) {
  res.send(getHeaderFields(req));
});

app.get('*', function(req, res) {
  res.status(404).send('API call not found');
});

function getHeaderFields(req) {
  var userAgent = req.headers['user-agent'];

  var ip = req.ip;
  var software = null;
  if (userAgent) {
    var matches = /\((.*?)\)/.exec(userAgent);
    // get the OS string (first parenthesis group) from the user agent
    if (matches) {
      software = matches[1];
    }
  }
  var language = req.acceptsLanguages();
  if (language && Array.isArray(language)) {
    language = language[0];
  }

  return { "ipaddress": ip, "language": language, "software": software };
}

app.listen(APP_PORT);

console.log("Running at port " + APP_PORT);
