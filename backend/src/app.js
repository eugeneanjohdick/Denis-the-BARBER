const express = require("express");
const debugRouter = require("./routes/debug");

const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

// Non protégé — sera verrouillé derrière requireAdmin en Brique 5
app.use("/debug", debugRouter);

module.exports = app;
