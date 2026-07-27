const express = require("express");
const debugRouter = require("./routes/debug");
const authRouter = require("./routes/auth");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK");
});

// Pas d'appel Airtable ici — c'est la route que le pingeur externe
// appellera toutes les ~10 min pour empêcher le tier gratuit de s'endormir.
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/debug", debugRouter);
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: "Erreur serveur" });
});

module.exports = app;
