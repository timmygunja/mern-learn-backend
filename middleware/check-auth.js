const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Authorization failed");
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userData = { userId: decodedToken.userId };

    next();
  } catch (err) {
    return next(new HttpError("Authentication failed", 401));
  }
};
