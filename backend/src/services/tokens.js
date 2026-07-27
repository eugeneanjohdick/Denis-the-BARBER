const jwt = require("jsonwebtoken");
const config = require("../config/env");

const DEFAULT_EXPIRES_IN = "30d";

function signToken(payload, expiresIn = DEFAULT_EXPIRES_IN) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

module.exports = { signToken, verifyToken };
