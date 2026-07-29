const DAY_NAMES = {
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

const MONTH_NAMES = {
  fr: [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

// Douala/Cameroun = UTC+1 fixe (pas d'heure d'ete) — meme convention que
// SALON_UTC_OFFSET_HOURS cote backend (backend/src/services/businessRules.js).
const SALON_UTC_OFFSET_HOURS = 1;

export function formatPrice(amount) {
  return `${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

export function formatDate(dateStr, language) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = DAY_NAMES[language][date.getDay()];
  const monthName = MONTH_NAMES[language][m - 1];
  return language === "en" ? `${dayName}, ${monthName} ${d}` : `${dayName} ${d} ${monthName}`;
}

export function isoToLocalDateTime(isoString) {
  const shifted = new Date(new Date(isoString).getTime() + SALON_UTC_OFFSET_HOURS * 3600 * 1000);
  const y = shifted.getUTCFullYear();
  const m = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const d = String(shifted.getUTCDate()).padStart(2, "0");
  const h = String(shifted.getUTCHours()).padStart(2, "0");
  const min = String(shifted.getUTCMinutes()).padStart(2, "0");
  return { date: `${y}-${m}-${d}`, time: `${h}:${min}` };
}
