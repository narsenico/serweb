var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('Hello World xxx');
});

app.listen(3000);