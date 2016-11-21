# passwordless-auth
A prototype implementation. Login without a password. Trade transient loginToken for persistant accessToken.

### loginToken
- expires in [n] min
- public
- sits in URL
- contains user + ts

### accessToken
- never expires
- private
- sits in localStorage
- contains user

# Tests
```
$ npm test
```

# TODOs
- [x] check accessToken on load
- [x] trade accessToken for secret
- [x] trade loginToken for persistant accessToken
- [x] send loginToken via e-mail
- [x] re-route instead of showing errors on client
- [x] only accept login from known users
- [x] proper error handling - server and client
- [x] `createAccessToken` needs a failure route
- [ ] `verifyLoginToken` and `decryptAccessToken` needs try catch block
- [x] remove invalid accessToken
- [x] add 404 route
- [x] put checkUser between `verifyLoginToken` and `createAccessToken`
- [x] `createAccessToken` should only create token
- [ ] modularize auth with args for `loginTokenValidWindow`, `encryption-key`
- [ ] use proper html for anchor when sending link
- [x] include URLparser in router

# licence
MIT
