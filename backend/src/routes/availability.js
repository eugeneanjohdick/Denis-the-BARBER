const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { getAvailableSlots } = require("../services/availability");
const { cachedList } = require("../services/airtableCache");

const router = express.Router();

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { staff, service, date } = req.query;
    if (!staff || !service || !date || !DATE_REGEX.test(date)) {
      return res.status(400).json({ error: "Paramètres requis : staff, service, date (YYYY-MM-DD)" });
    }

    const services = await cachedList("Services");
    const serviceRecord = services.find((s) => s.id === service);
    if (!serviceRecord) {
      return res.status(404).json({ error: "Prestation introuvable" });
    }

    const slots = await getAvailableSlots({
      staffId: staff,
      serviceDurationMinutes: serviceRecord.duration_minutes,
      date,
    });

    res.status(200).json({ date, staff, service, slots });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
