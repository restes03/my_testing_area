var express = require('express');
var app = express();

app.get('/user/:id', function(req, res) {
  res.send('user ' + req.params.id);
});