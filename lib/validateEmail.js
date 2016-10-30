var https = require('https'),
    settings = require('../settings.json'),
    api_key = settings.mailgun_pub_apiKey,
    root = 'https://api.mailgun.net/v3/address/validate',
    querystring = require('querystring');

function validate(url, next) {
  https.get(url, function(res){
    var data = '';

    res
      .on('error', next)
      .on('data', function(chunk){
        data += chunk;
      })
      .on('end', function(){
        try {
          var emailValid = JSON.parse(data).is_valid;

          if (!emailValid) {
            return next('invalid e-mail');
          }
          return next();

        } catch (e) {
          return next(e.message);
        }
      });
  }).on('error', next);
}

module.exports = function(req, res, next) {
  var query = querystring.stringify({
        address: req.data.email,
        api_key: api_key
      }),
      url = root + '?' + query;

  validate(url, next);
}
