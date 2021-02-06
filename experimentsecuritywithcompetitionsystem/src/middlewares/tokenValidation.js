const config = require('../config/config');
const jwt = require('jsonwebtoken');
const JWT_SECRET_user = config.JWTKeyUser;
const JWT_SECRET_admin = config.JWTKeyAdmin;
const user = require('../services/userService')

exports.userVerifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("unauthorised");
    return;
  }
  const token = authHeader.replace("Bearer ", "");

  try {
    let isValid = true;
    checkTokens = await user.getTokenBlacklist()

    checkTokens.forEach(checkToken => {
      if (token == checkToken.token) {
        isValid = false;
      }
    });

    if (isValid) {
      var options = {
        algorithms: ["HS256"]
      };
      jwt.verify(token, JWT_SECRET_user, options, function (error, decodedToken) {
        if (error) {
          jwt.verify(token, JWT_SECRET_admin, options, function (error, decodedToken) {
            if (error) {
              res.status(401).send("unauthorised");
              return;
            }
            else {
              req.decodedToken = decodedToken;
              next();
            }
          });

        }
        else {
          req.decodedToken = decodedToken;
          next();
        }
      });
    } else {
      res.status(401).send("unauthorised");
      return;
    }

  } catch (error) {
    res.status(500).send("Unable to perform action.");
    return;
  }


};


exports.adminVerifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("unauthorised");
    return;
  }
  const token = authHeader.replace("Bearer ", "");

  try {
    let isValid = true;
    checkTokens = await user.getTokenBlacklist()

    checkTokens.forEach(checkToken => {
      if (token == checkToken.token) {
        isValid = false;
      }
    });

    if (isValid) {
      var options = {
        algorithms: ["HS256"]
      };
      jwt.verify(token, JWT_SECRET_admin, options, function (error, decodedToken) {
        if (error) {
          res.status(401).send("unauthorised");
          return;
        }
        req.decodedToken = decodedToken;
        next();
      });
    } else {
      res.status(401).send("unauthorised");
      return;
    }

  } catch (error) {
    res.status(500).send("Unable to perform action.");
    return;
  }


};