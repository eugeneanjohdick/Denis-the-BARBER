const express = require("express");
const debugRouter = require("./routes/debug");

const app = express();

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

module.exports = app;
