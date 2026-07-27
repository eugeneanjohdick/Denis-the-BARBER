const rateLimit = require("express-rate-limit");

function createRateLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message || "Trop de requêtes, réessaie plus tard." },
  });
}

module.exports = { createRateLimiter };
