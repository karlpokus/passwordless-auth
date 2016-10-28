var settings = require('../settings.json'), 
    api_key = settings.mailgun_sec_apiKey,
    domain = settings.mailgun_domain,
    root = settings.root_url,
    mail = require('mailgun-js')({apiKey: api_key, domain: domain});
    
function sendMail(email, url, next) {
  var data = {
    from: 'App <noreply@example.com>',
    to: email,
    subject: 'App loginToken',
    text: 'Use this URL to login. It will expire in 5 min\n\n' + url
  };

  mail.messages().send(data, function (err, body) {
    if (err) return next(err);

    return next();
  });
}

module.exports = function(req, res, next) {
  var url = root + '/token?token=' + req.loginToken;
  sendMail(req.data.email, url, next);
}
