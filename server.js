var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    root = 'localhost:3000' // https://hej-node-karlpokus.c9users.io
    dataparser = require('./lib/dataparser'),
    auth = require('./lib/auth'),
    sendTheBasics = function(req, res){
      res.sendFile(__dirname + '/public/index.html');
    };

app.use(express.static('public'))

app.get('/', sendTheBasics);
app.get('/user', sendTheBasics);
app.get('/loginToken', sendTheBasics);

// Trade e-mail for loginURL
app.post('/login', dataparser, auth.createLoginToken, function(req, res){
  var url = '/loginToken?loginToken=' + req.loginToken; // exclude root on localhost
  res.end(url);
});

// Trade loginToken for accessToken
app.post('/accessToken', dataparser, auth.verifyLoginToken, auth.createAccessToken, function(req, res, next){
  res.end(req.accessToken);
});

// Trade accessToken for secret
app.post('/secret', dataparser, auth.verifyAccessToken, function(req, res){
  res.end(JSON.stringify({
    ok: req.authenticated,
    secret: (req.authenticated)? 'bob is awesome': null
  }));
});

app.listen(port, function () {
  console.log('Server running..');
});
