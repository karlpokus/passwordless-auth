// root: env
// localhost:3000
// https://hej-node-karlpokus.c9users.io

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    env = process.env.NODE_ENV || 'space',
    dataparser = require('./lib/dataparser'),
    checkUser = require('./lib/checkUser'),
    auth = require('./lib/auth'),
    sendTheBasics = function(req, res){
      res.sendFile(__dirname + '/public/index.html');
    },
    errorHandler = function(err, req, res, next) {
      res.status(err.status || 500).send(err.message || err);
    };

app.use(express.static('public'))

app.get('/', sendTheBasics);
app.get('/user', sendTheBasics);
app.get('/loginToken', sendTheBasics);

// Trade e-mail for loginURLwithLoginToken
app.post('/login', dataparser, checkUser, auth.createLoginToken, function(req, res){
  var url = '/loginToken?loginToken=' + req.loginToken; // exclude root on localhost
  res.end(url);
});

// Trade loginToken for accessToken
app.post('/accessToken', dataparser, auth.verifyLoginToken, auth.createAccessToken, function(req, res, next){
  res.end(req.accessToken);
});

// Trade accessToken for secret
app.post('/secret', dataparser, auth.decryptAccessToken, checkUser, function(req, res){
  res.end('hi I am secret');
});

app.use(errorHandler);

app.listen(port, function () {
  console.log('Server running in ' + env);
});
