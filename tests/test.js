var test = require('tape'),
    auth = require('../lib/auth');

test('auth', function(t){
  var user = 'bob@example.com',
      req = {data: {user: user}},
      res = {};
  
  // create loginToken
  auth.createLoginToken(req, res, function(){
    t.ok(req.loginToken, 'we have a loginToken');
    req.data.token = req.loginToken;
    
    // verify loginToken
    auth.verifyLoginToken(req, res, function(){
      t.equal(req.data.user, user, 'user decrypted from loginToken');
      
      // create accessToken
      auth.createAccessToken(req, res, function(){
        t.ok(req.accessToken, 'we have an accessToken');
        req.data.token = req.accessToken;
        
        // decrypt accessToken
        auth.decryptAccessToken(req, res, function(){
          t.equal(req.data.user, user, 'user decrypted from accessToken');
          t.end();
        })
      });
    });
  });
});