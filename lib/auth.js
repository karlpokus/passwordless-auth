var Cryptr = require('cryptr'),
    cryptr = new Cryptr('super-secret-key');

var auth = {
  createLoginToken: function(req, res, next) {
    var d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    var ts = d.getTime();

    req.loginToken = cryptr.encrypt(req.data.user + ";" + ts);
    return next();
  },
  verifyLoginToken: function(req, res, next) {
    var token = req.data.token,
        decrypted = cryptr.decrypt(token),
        parts = decrypted.split(';'),
        ts = parts[1],
        d = new Date(),
        now = d.getTime();
    req.user = parts[0];

    req.authenticated = (ts > now)? true: false;
    return next();
  },
  createAccessToken: function(req, res, next) {
    if (req.authenticated) {
      var token = cryptr.encrypt(req.user);
      res.end(token);
    } else {
      next('invalid loginToken');
    }
  },
  decryptAccessToken: function(req, res, next) {
    var token = req.data.token;
    req.data.user = cryptr.decrypt(token);
    next();
  }
};

module.exports = auth;
