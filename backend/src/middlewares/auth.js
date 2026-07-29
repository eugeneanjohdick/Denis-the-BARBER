const { verifyToken } = require("../services/tokens");

function extractToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" ? token : null;
}

function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authentification requise" });
  }

  try {
    req.auth = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.auth.role !== "admin") {
      return res.status(403).json({ error: "Accès réservé aux administrateurs" });
    }
    next();
  });
}

function requireManager(req, res, next) {
  requireAdmin(req, res, () => {
    if (req.auth.adminLevel !== "manager") {
      return res.status(403).json({ error: "Accès réservé au gérant" });
    }
    next();
  });
}

module.exports = { requireAuth, requireAdmin, requireManager };
