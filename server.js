var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    dataparser = require('./lib/dataparser'),
    auth = require('./lib/auth'),
    sendTheBasics = function(res){
      res.sendFile(__dirname + '/public/index.html');
    };

app.use(express.static('public'))

app.get('/', function (req, res) {
  sendTheBasics(res);
});

app.get('/user', function (req, res) {
  sendTheBasics(res);
});

// NOT DONE
app.post('/accessToken', dataparser, function(req, res, next){
  console.log(req.data);
  res.end('hi');
});

// DONE!
app.post('/login', dataparser, auth.createLoginToken, function(req, res){
  var url = 'https://hej-node-karlpokus.c9users.io/loginToken?loginToken=' + req.loginToken;
  res.end(url);
});

// WIP!
app.get('/loginToken', dataparser, auth.verifyLoginToken, auth.createAccessToken, function(req, res){
  if (req.accessToken) {
    //res.end(req.accessToken); // wat?
    // res.redirect(200, '/');
    
  } else {
    res.redirect(401, '/');
  }
});

app.listen(port, function () {
  console.log('Server running..');
});