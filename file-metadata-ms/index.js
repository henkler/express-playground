var express = require('express');
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var upload = multer({ dest: 'uploads/' });

var app = express();

const APP_PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname + '/public');

app.use(express.static('public'));

app.get('/', function(req,res) {
  res.sendFile(PUBLIC_DIR + '/index.html');
});

app.post('/api/filemetadata/', upload.single('metadata'), function(req, res, next) {
  if (req.file) {
    res.send({"size": req.file.size});
    if (req.file.path) {
      fs.unlinkSync(req.file.path);
    }
  }
  else {
    res.send({"error": "Unknown error"});
  }
});

app.get('*', function(req,res) {
  res.status(404).send('Invalid short URL');
});

app.listen(APP_PORT);

console.log("Running at port " + APP_PORT);
