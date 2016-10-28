# passwordless-auth
A prototype implementation

# goals
- [x] login/signup without a password via loginToken
- [ ] trade loginToken for accessToken
- [ ] access protected resources without a password via accessToken

### loginToken
- expires in [n] min
- public
- sits in URL

### accessToken
- never expires
- private
- sits in localStorage

# test
```
# login/signup
$ curl -d 'email=foo@mailgun.net' <url>
```

# licence
MIT
