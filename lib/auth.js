var Cryptr = require('cryptr');
    cryptr = new Cryptr('super-secret-key');

var users = [
  'foo@example.com'
];

function createToken(str) {
  return cryptr.encrypt(str);
}

function verifyToken(token) {
  var email = this.cryptr.decrypt(token);
  return (users.indexOf(email) > -1);
}

var email = 'foo@example.com',
    token = createToken(email),
    res = verifyToken(token);

console.log('token is ', token);
console.log('res', res);
