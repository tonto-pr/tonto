var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var http = require('http');

var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'html');

app.get('/read', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/about', function(req, res, next) {
    res.download('test_feed_oyoy.csv.gz');
})

app.post('/create', function(req, res, next) {
    res.json({'crud': 'CREATE'});
})

app.post('/update', function(req, res, next) {
    res.json({'crud': 'UPDATE'});
})

app.delete('/delete', function(req, res, next) {
    res.json({'crud': 'DELETE'});
})

var server = http.createServer(app);
server.listen(port);

console.log(`Listening on port ${port}`);