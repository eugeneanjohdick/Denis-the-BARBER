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

module.exports = { createAppointment };
