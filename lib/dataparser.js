var querystring = require('querystring');

module.exports = function(req, res, next) {

  var data = '';
  req
    .on('error', next)
    .on('data', function(chunk){
      data += chunk;
    })
    .on('end', function(){
      if (!data) {
        return next('data is empty string');
      }
      var parsedQuery = querystring.parse(data);

      if (!parsedQuery.email) {
        return next('no email in data');
      }
      req.data = parsedQuery;
      return next();
    });
}
