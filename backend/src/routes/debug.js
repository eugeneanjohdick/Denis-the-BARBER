const express = require("express");
const airtableClient = require("../services/airtableClient");
const { cachedList } = require("../services/airtableCache");
const { requireAdmin } = require("../middlewares/auth");

const router = express.Router();

router.use(requireAdmin);

router.get("/airtable-calls", (req, res) => {
  res.json(airtableClient.getCallStats());
});

router.get("/services", async (req, res, next) => {
  try {
    const services = await cachedList("Services");
    res.json(services);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
