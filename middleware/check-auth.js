const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // string "Bearer <token>"
    
    if (!token) {
      throw new Error("Authorization failed");
    }

    const decodedToken = jwt.verify(token, "supersecret_key");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Authentication failed", 401));
  }
};
