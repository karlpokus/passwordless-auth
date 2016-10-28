var Cryptr = require('cryptr');
    cryptr = new Cryptr('super-secret-key');

var auth = {
  createLoginToken: function(req, res, next) {
    var d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    var ts = d.getTime();
      
    req.loginToken = cryptr.encrypt(req.data.email + ";" + ts);
    return next();
  },
  verifyXToken: function(req, res, next) {        
    //var email = cryptr.decrypt(token);
    //return (users.indexOf(email) > -1);
    // check expiration date
  }
};

module.exports = auth;
