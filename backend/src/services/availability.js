const airtableClient = require("./airtableClient");
const { cachedList } = require("./airtableCache");
const { computeAvailableSlots } = require("./availabilityCalculator");
const { SALON_UTC_OFFSET_HOURS } = require("./businessRules");

const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function frenchDayName(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return DAY_NAMES[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

// Douala/Afrique = UTC+1 fixe (pas d'heure d'ete) : voir SALON_UTC_OFFSET_HOURS.
function isoToLocalMinutes(isoString) {
  const d = new Date(isoString);
  const utcMinutes = d.getUTCHours() * 60 + d.getUTCMinutes();
  return (utcMinutes + SALON_UTC_OFFSET_HOURS * 60 + 1440) % 1440;
}

function isoToLocalDateString(isoString) {
  const shifted = new Date(new Date(isoString).getTime() + SALON_UTC_OFFSET_HOURS * 3600 * 1000);
  const y = shifted.getUTCFullYear();
  const m = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const d = String(shifted.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Fenetre large (+/- 1 jour UTC) pour ne pas dependre du fuseau configure
// sur le champ Airtable start_datetime ; le filtrage precis se fait ensuite
// en JS via isoToLocalDateString.
function localDateUtcRange(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const startUtc = new Date(Date.UTC(y, m - 1, d, -SALON_UTC_OFFSET_HOURS, -1));
  const endUtc = new Date(Date.UTC(y, m - 1, d + 1, -SALON_UTC_OFFSET_HOURS, 1));
  return { startUtc, endUtc };
}

async function getAvailableSlots({ staffId, serviceDurationMinutes, date, minStartMinutes = 0 }) {
  const dayName = frenchDayName(date);

  const [plannings, exceptions, closures] = await Promise.all([
    cachedList("Plannings_Coiffeur"),
    cachedList("Exceptions_Coiffeur"),
    cachedList("Fermetures_Agence"),
  ]);

  const isAgencyClosed = closures.some((c) => date >= c.date_start && date <= c.date_end);
  if (isAgencyClosed) return [];

  const planning = plannings.find(
    (p) => p.staff && p.staff.includes(staffId) && p.day_of_week === dayName
  );

  const staffExceptions = exceptions.filter((e) => e.staff && e.staff.includes(staffId));
  const fullDayException = staffExceptions.some(
    (e) => e.full_day && date >= e.date_start && date <= e.date_end
  );
  const partialExceptions = staffExceptions
    .filter((e) => !e.full_day && date >= e.date_start && date <= e.date_end)
    .map((e) => ({ start_time: e.start_time, end_time: e.end_time }));

  const { startUtc, endUtc } = localDateUtcRange(date);
  const appointments = await airtableClient.list("RendezVous", {
    filterByFormula: `AND(IS_AFTER({start_datetime}, "${startUtc.toISOString()}"), IS_BEFORE({start_datetime}, "${endUtc.toISOString()}"), LOWER({status})="confirmé")`,
  });

  const busyIntervals = appointments
    .filter((a) => a.staff && a.staff.includes(staffId) && isoToLocalDateString(a.start_datetime) === date)
    .map((a) => [isoToLocalMinutes(a.start_datetime), isoToLocalMinutes(a.end_datetime)]);

  return computeAvailableSlots({
    planning,
    fullDayException,
    partialExceptions,
    busyIntervals,
    serviceDurationMinutes,
    minStartMinutes,
  });
}

module.exports = { getAvailableSlots, frenchDayName };
