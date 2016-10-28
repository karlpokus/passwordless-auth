var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    pype = require('pype-stack'),
    dataparser = require('./lib/dataparser'),
    validateEmail = require('./lib/validateEmail'),
    checkUsername = require('./lib/checkUsername'),
    auth = require('./lib/auth'),
    sendLink = require('./lib/sendLink'),
    logup = [dataparser, validateEmail, checkUsername, auth.createLoginToken, sendLink],
    server = http.createServer(),
    port = process.env.PORT || 3000,
    errorHandler = function(err, req, res){
      console.error(err);
      res.end('Server error');
    },
    send = function(file, res){
      file = (file === '/')? 'public/index.html': file;
      var filePath = path.join(__dirname, file);
      fs.createReadStream(filePath)
        .pipe(res);
    };

server.on('request', function(req, res){
  var pathname = url.parse(req.url).pathname;
    
  // home && js
  if (pathname === '/' || pathname === '/public/index.js') {
    send(req.url, res);
  }
  // login/signup
  if (req.method === 'POST' && req.url === '/logup') {
    pype(null, logup, errorHandler, function(req, res){
      res.end();
    })(req, res);
  }
  // accessToken in localstorage
  if (req.method === 'POST' && pathname === '/accessToken') {
    // validate token
  }
  // loginToken in URL
  if (req.method === 'POST' && pathname === '/loginToken') {
    // validate
  }
});

server.listen(port, function(){
  console.log('Server running..');
});
