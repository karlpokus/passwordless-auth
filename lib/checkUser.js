var path = require('path'),
    file = path.join(__dirname, '..', 'users.json'),
    users = require(file),
    Knas = require('knas');

module.exports = function(req, res, next) {
    if (users.indexOf(req.data.user) === -1) {
      next(new Knas(401, "invalid user"));
    } else {
      next();
    }
}
