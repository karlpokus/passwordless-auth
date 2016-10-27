module.exports = function(req, res, next) {
  console.log('token', req.token);
  return next();
}