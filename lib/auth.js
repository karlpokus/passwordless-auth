var Cryptr = require('cryptr'),
    cryptr = new Cryptr('super-secret-key'),
    Knas = require('knas');

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
        user = parts[0],
        ts = parts[1],
        d = new Date(),
        now = d.getTime(),
        authenticated = (ts > now)? true: false;
    req.data.user = user;

    if (authenticated) {
      next();
    } else {
      next(new Knas(401, "invalid loginToken"));
    }
  },
  createAccessToken: function(req, res, next) {
    req.accessToken = cryptr.encrypt(req.data.user);
    next();
  },
  decryptAccessToken: function(req, res, next) {
    var token = req.data.token;
    req.data.user = cryptr.decrypt(token);
    next();
  }
};

module.exports = auth;
