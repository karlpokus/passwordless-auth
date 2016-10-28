var fs = require('fs'),
    path = require('path'),
    file = path.join(__dirname, '..', 'users.json'),
    users = require(file);

module.exports = function(req, res, next) {
    var email = req.data.email;
    
    if (users.indexOf(email) > -1) {
      return next();
    } else {
      users.push(email);
      fs.createWriteStream(file)
        .end(JSON.stringify(users), 'utf8', next);
    }
}
