const airtableClient = require("./airtableClient");
const { cachedList } = require("./airtableCache");
const { getAvailableSlots, localDateTimeToUtcIso } = require("./availability");
const { parseTimeToMinutes, minutesToTime } = require("./timeUtils");
const { withLock } = require("./lock");

async function createAppointment({ clientId, staffId, serviceId, date, start }) {
  return withLock(`${staffId}:${date}`, async () => {
    const [services, staffList] = await Promise.all([
      cachedList("Services"),
      cachedList("Coiffeurs"),
    ]);

    const service = services.find((s) => s.id === serviceId);
    if (!service) {
      const err = new Error("Prestation introuvable");
      err.status = 404;
      throw err;
    }

    const staff = staffList.find((s) => s.id === staffId);
    if (!staff) {
      const err = new Error("Coiffeur introuvable");
      err.status = 404;
      throw err;
    }

    // Revalidation dans le verrou : la disponibilité a pu changer entre
    // l'appel a /availability par le client et cette confirmation.
    const availableSlots = await getAvailableSlots({
      staffId,
      serviceDurationMinutes: service.duration_minutes,
      date,
    });

    if (!availableSlots.some((slot) => slot.start === start)) {
      const err = new Error("Ce créneau n'est plus disponible");
      err.status = 409;
      throw err;
    }

    const endMinutes = parseTimeToMinutes(start) + service.duration_minutes;

    const [created] = await airtableClient.batchCreate("RendezVous", [
      {
        agency: staff.agency,
        client: [clientId],
        staff: [staffId],
        service: [serviceId],
        start_datetime: localDateTimeToUtcIso(date, start),
        end_datetime: localDateTimeToUtcIso(date, minutesToTime(endMinutes)),
        status: "Confirmé",
        price_charged_fcfa: service.price_fcfa,
        duration_charged_minutes: service.duration_minutes,
        source: "app",
      },
    ]);

    return created;
  });
}

const CANCELLATION_WINDOW_HOURS = 24;

async function cancelAppointment({ appointmentId, actorId, actorRole }) {
  let appointment;
  try {
    appointment = await airtableClient.getById("RendezVous", appointmentId);
  } catch (e) {
    const err = new Error("Rendez-vous introuvable");
    err.status = 404;
    throw err;
  }

  if (actorRole === "client" && !(appointment.client || []).includes(actorId)) {
    const err = new Error("Ce rendez-vous ne vous appartient pas");
    err.status = 403;
    throw err;
  }

  if (appointment.status !== "Confirmé") {
    const err = new Error("Ce rendez-vous ne peut plus être annulé");
    err.status = 409;
    throw err;
  }

  if (actorRole === "client") {
    const hoursUntilStart = (new Date(appointment.start_datetime) - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilStart < CANCELLATION_WINDOW_HOURS) {
      const err = new Error("Passé le délai d'annulation gratuite (24h avant le rendez-vous)");
      err.status = 403;
      throw err;
    }
  }

  const [updated] = await airtableClient.batchUpdate("RendezVous", [
    {
      id: appointmentId,
      fields: {
        status: "Annulé",
        cancelled_at: new Date().toISOString(),
        cancelled_by: actorRole === "admin" ? "Admin" : "Client",
      },
    },
  ]);

  return updated;
}

module.exports = { createAppointment, cancelAppointment };
