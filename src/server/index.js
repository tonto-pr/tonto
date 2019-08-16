var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var http = require('http');
var OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

const spec = path.join(__dirname, 'openapi.yml');
app.use('/spec', express.static(spec));

new OpenApiValidator({
    apiSpecPath: './openapi.yml'
}).install(app);

app.get('/entity/:id', function(req, res, next) {
    res.json({'id': req.params.id});
})

app.post('/entity/create', function(req, res, next) {
    res.json({'id': '123'});
})

app.post('/entity/:id', function(req, res, next) {
    res.json({'entity': req.params.id, name: "tester"});
})

app.delete('/entity/:id', function(req, res, next) {
    res.json({'crud': 'DELETE'});
})

var server = http.createServer(app);
server.listen(port);

console.log(`Listening on port ${port}`);