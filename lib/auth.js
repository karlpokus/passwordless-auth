var Cryptr = require('cryptr');
    cryptr = new Cryptr('super-secret-key');

var auth = {
  createToken: function(req, res, next) {
    if (req.data && req.data.email) {
      req.token = cryptr.encrypt(req.data.email);
      return next();
      
    } else {
      return next('unable to create token');
    }    
  },
  verifyToken: function(req, res, next) {        
    //var email = this.cryptr.decrypt(token);
    //return (users.indexOf(email) > -1);
  }
};

module.exports = auth;
