var admin = require('./firdatabase');

module.exports.isAuthenticated = function (req, res, next) {
    var authorization = req.headers["authorization"];
    if (!authorization) {
      res.status(401)
      res.json({"error": "There is no Authorization header."});
      return false;
    }
    if(!authorization.includes("Bearer ")) {
      res.status(401)
      res.json({"error": 'Format the Authorization header as "Bearer <Token>"'});
      return false;
    }
    var token = authorization.split(" ")[1];
    admin.auth().verifyIdToken(token)
      .then(function(decodedToken) {
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          is_email_verified: decodedToken.email_verified
        };
        return next();
      }).catch(function(error) {
        res.status(401)
        res.json({"error": "You are not authorized."});
        return false;
      });
}
