module.exports = function(req, res, next) {

  var data = '';
  req
    .on('error', next)
    .on('data', function(chunk){
      data += chunk;
    })    
    .on('end', function(){
      if (!data) {
        return next('no data to parse');
      }
      var o = {};

      // body is considered urlencoded
      data.split('&').forEach(function(part){
        var parts = part.split('='),
            k = parts[0],
            v = decodeURIComponent(parts[1])
        o[k] = v;
      });

      if (!o.email) {
        return next('no email in data');
      }
      req.data = o;
      return next();
    });
}
