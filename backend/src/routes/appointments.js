const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { createAppointment } = require("../services/appointments");

const router = express.Router();

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}$/;

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (req.auth.role !== "client") {
      return res.status(403).json({ error: "Réservé aux clients" });
    }

    const { staff, service, date, start } = req.body;
    if (!staff || !service || !date || !start || !DATE_REGEX.test(date) || !TIME_REGEX.test(start)) {
      return res.status(400).json({ error: "Paramètres requis : staff, service, date (YYYY-MM-DD), start (HH:mm)" });
    }

    const appointment = await createAppointment({
      clientId: req.auth.sub,
      staffId: staff,
      serviceId: service,
      date,
      start,
    });

    res.status(201).json({ appointment });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
