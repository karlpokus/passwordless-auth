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
- [ ] send loginToken via e-mail
- [ ] re-route instead of showing errors on client
- [ ] fix router
- [x] only accept login from known users
- [x] proper error handling - server and client
- [ ] `auth.createAccessToken`needs a failure route
- [ ] `auth.decryptAccessToken` needs a try catch block

# licence
MIT
