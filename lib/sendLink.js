var settings = require('../settings.json'),
    api_key = settings.mailgun_sec_apiKey,
    domain = settings.mailgun_domain,
    root = settings.root_url_c9,
    mail = require('mailgun-js')({apiKey: api_key, domain: domain});

function sendMail(req, res, next) {
  var url = root + '/loginToken?loginToken=' + req.loginToken,
      anchor = '<a href="' + url + '">' + url + '</a>',
      data = {
        from: 'App <noreply@example.com>',
        to: req.data.user,
        subject: 'App loginToken',
        text: 'Use this URL to login. It will expire in 5 min\n\n' + anchor
      };

  mail.messages().send(data, function (err, body) {
    if (err) return next(err);

    res.end('E-mail sent');
  });
}

module.exports = function(req, res, next) {
  sendMail(req, res, next);
}
