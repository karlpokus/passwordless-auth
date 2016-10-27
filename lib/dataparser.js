module.exports = function(req, res, next) {

  var data = '';
  req
    .on('data', function(chunk){
      data += chunk;
    })
    .on('error', next)
    .on('end', function(){
      var o = {};

      // body is considered urlencoded
      data.split('&').forEach(function(part){
        var parts = part.split('='),
            k = parts[0],
            v = decodeURIComponent(parts[1])
        o[k] = v;
      });

      req.data = o;
      return next();
    });
}
