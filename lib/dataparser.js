var url = require('url'),
    querystring = require('querystring');

module.exports = function(req, res, next) {

  var data = '';
  req
    .on('error', next)
    .on('data', function(chunk){
      data += chunk;
    })
    .on('end', function(){
      req.data = querystring.parse(data);
      req.query = url.parse(req.url, true).query;
      
      return next();
    });
}
