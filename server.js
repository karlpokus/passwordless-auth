var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    pype = require('pype-stack'),
    dataparser = require('./lib/dataparser'),
    auth = require('./lib/auth'),
    server = http.createServer(),
    port = process.env.PORT || 3000,
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
    // login/signup
    if (req.method === 'POST' && req.url === '/user') {

      pype(null, [dataparser], null, function(req, res){
        console.log(req.data);
        res.end();
      })(req, res);


    }

  }).listen(port, function(){
    console.log('Server running..');
  });
