var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    //users = require('./users'),
    pype = require('pype-stack'),
    dataparser = require('./lib/dataparser'),
    checkUsername = require('./lib/checkUsername'),
    auth = require('./lib/auth'),
    sendLink = require('./lib/sendLink'),
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
    // home && js
    if (req.url === '/' || req.url === '/public/index.js') {
      send(req.url, res);
    }
    // token
    if (req.method === 'POST' && req.url === '/token') {
      // validate token
    }
    // login/signup
    if (req.method === 'POST' && req.url === '/logup') {
      pype(null, [dataparser, checkUsername, auth.createToken, sendLink], errorHandler, function(req, res){
        //console.log(req.data);
        res.end();
      })(req, res);
    }
});

server.listen(port, function(){
  console.log('Server running..');
});
