// Tolerant aux variantes de saisie Airtable ("09:30", "09h:30", "09h30"...)
// on extrait juste les chiffres et on prend les 2 derniers comme minutes.
function parseTimeToMinutes(raw) {
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length < 3) {
    throw new Error(`Format d'heure invalide : "${raw}"`);
  }
  const h = Number(digits.slice(0, -2));
  const m = Number(digits.slice(-2));
  return h * 60 + m;
}

function minutesToTime(totalMinutes) {
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const m = String(totalMinutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

module.exports = { parseTimeToMinutes, minutesToTime };
