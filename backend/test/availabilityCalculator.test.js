const test = require("node:test");
const assert = require("node:assert/strict");
const { computeAvailableSlots } = require("../src/services/availabilityCalculator");

const FULL_DAY_PLANNING = {
  is_working: true,
  morning_start: "09:30",
  morning_end: "12:00",
  afternoon_start: "13:00",
  afternoon_end: "22:30",
};

test("journée complète, sans contrainte : premier et dernier créneau corrects", () => {
  const slots = computeAvailableSlots({ planning: FULL_DAY_PLANNING, serviceDurationMinutes: 60 });

  assert.deepEqual(slots[0], { start: "09:30", end: "10:30" });
  assert.ok(slots.some((s) => s.start === "11:00" && s.end === "12:00"), "dernier créneau du matin (11:00) manquant");
  assert.ok(!slots.some((s) => s.start === "11:10"), "11:10 déborderait sur la pause déjeuner");
});

test("dernier créneau avant la fermeture du soir (22:30)", () => {
  const slots = computeAvailableSlots({ planning: FULL_DAY_PLANNING, serviceDurationMinutes: 60 });

  assert.ok(slots.some((s) => s.start === "21:30" && s.end === "22:30"), "21:30 devrait être le dernier créneau valide");
  assert.ok(!slots.some((s) => s.start === "21:40"), "21:40 déborderait de la fermeture (22:40 > 22:30)");
});

test("RDV collé à la pause : le tampon bloque les créneaux juste avant", () => {
  // RDV existant 11:00-12:00, tampon 10 min -> bloque a partir de 09:50 environ
  const slots = computeAvailableSlots({
    planning: FULL_DAY_PLANNING,
    serviceDurationMinutes: 60,
    busyIntervals: [[660, 720]], // 11:00-12:00
    bufferMinutes: 10,
  });

  assert.ok(!slots.some((s) => s.start === "10:00"), "10:00 chevauche le RDV existant + tampon");
  assert.ok(slots.some((s) => s.start === "09:40"), "09:40 devrait rester libre (hors tampon)");
});

test("jour de congé exceptionnel (journée entière) : aucun créneau", () => {
  const slots = computeAvailableSlots({
    planning: FULL_DAY_PLANNING,
    serviceDurationMinutes: 60,
    fullDayException: true,
  });

  assert.deepEqual(slots, []);
});

test("exception partielle : les créneaux dans la plage bloquée disparaissent", () => {
  const slots = computeAvailableSlots({
    planning: FULL_DAY_PLANNING,
    serviceDurationMinutes: 30,
    partialExceptions: [{ start_time: "10:00", end_time: "11:00" }],
  });

  assert.ok(!slots.some((s) => s.start === "10:15"), "10:15 est dans la plage d'exception");
  assert.ok(slots.some((s) => s.start === "09:30"), "09:30 devrait rester libre, avant l'exception");
  assert.ok(slots.some((s) => s.start === "11:00"), "11:00 devrait redevenir libre, juste après l'exception");
});

test("minStartMinutes exclut les créneaux déjà passés (jour même)", () => {
  const slots = computeAvailableSlots({
    planning: FULL_DAY_PLANNING,
    serviceDurationMinutes: 30,
    minStartMinutes: 600, // 10:00
  });

  assert.ok(!slots.some((s) => s.start < "10:00"), "aucun créneau avant 10:00 ne devrait apparaître");
  assert.ok(slots.some((s) => s.start === "10:00"), "10:00 devrait être le premier créneau disponible");
});

test("coiffeur non planifié ce jour-là : aucun créneau", () => {
  const slots = computeAvailableSlots({
    planning: { ...FULL_DAY_PLANNING, is_working: false },
    serviceDurationMinutes: 30,
  });

  assert.deepEqual(slots, []);
});
