const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { createAppointment, cancelAppointment, listAppointmentsForClient } = require("../services/appointments");

const router = express.Router();

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}$/;

function toPublicAppointment(record) {
  return {
    id: record.id,
    service: record.service?.[0] ?? null,
    staff: record.staff?.[0] ?? null,
    start_datetime: record.start_datetime,
    end_datetime: record.end_datetime,
    status: record.status,
    price_charged_fcfa: record.price_charged_fcfa,
    duration_charged_minutes: record.duration_charged_minutes,
    cancelled_at: record.cancelled_at ?? null,
    cancelled_by: record.cancelled_by ?? null,
  };
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    if (req.auth.role !== "client") {
      return res.status(403).json({ error: "Réservé aux clients" });
    }

    const { client } = req.query;
    if (client && client !== req.auth.sub) {
      return res.status(403).json({ error: "Accès non autorisé à ces rendez-vous" });
    }

    const appointments = await listAppointmentsForClient({ clientId: req.auth.sub });
    res.status(200).json({ appointments: appointments.map(toPublicAppointment) });
  } catch (err) {
    next(err);
  }
});

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

router.post("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    const appointment = await cancelAppointment({
      appointmentId: req.params.id,
      actorId: req.auth.sub,
      actorRole: req.auth.role,
    });

    res.status(200).json({ appointment });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
