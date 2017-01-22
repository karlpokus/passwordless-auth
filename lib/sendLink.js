var settings = require('../settings.json'),
    api_key = settings.mailgun_sec_apiKey,
    domain = settings.mailgun_domain_pokusdev,
    root = settings.root_url_localhost, //settings.root_url_c9,
    mail = require('mailgun-js')({apiKey: api_key, domain: domain});

function sendMail(req, res, next) {
  var url = root + '/loginToken?loginToken=' + req.loginToken,
      anchor = '<a href="' + url + '">link</a>',
      data = {
        from: 'bob <bob@example.com>',
        to: req.data.user,
        subject: 'App loginToken',
        text: 'Use this URL to login. It will expire in 5 min\n\n' + anchor
      };

  mail.messages().send(data, function (err, body) {
    if (err) return next(err);

    res.end('E-mail sent');
  });
}

module.exports = sendMail;
