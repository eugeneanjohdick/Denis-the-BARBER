const { parseTimeToMinutes, minutesToTime } = require("./timeUtils");
const { BUFFER_MINUTES, SLOT_STEP_MINUTES } = require("./businessRules");

function buildWindows(planning) {
  const windows = [];
  if (planning.morning_start && planning.morning_end) {
    windows.push([parseTimeToMinutes(planning.morning_start), parseTimeToMinutes(planning.morning_end)]);
  }
  if (planning.afternoon_start && planning.afternoon_end) {
    windows.push([parseTimeToMinutes(planning.afternoon_start), parseTimeToMinutes(planning.afternoon_end)]);
  }
  return windows;
}

function subtractInterval(windows, [blockStart, blockEnd]) {
  const result = [];
  for (const [start, end] of windows) {
    if (blockEnd <= start || blockStart >= end) {
      result.push([start, end]);
      continue;
    }
    if (blockStart > start) result.push([start, blockStart]);
    if (blockEnd < end) result.push([blockEnd, end]);
  }
  return result;
}

function computeAvailableSlots({
  planning,
  fullDayException = false,
  partialExceptions = [],
  busyIntervals = [],
  serviceDurationMinutes,
  bufferMinutes = BUFFER_MINUTES,
  slotStepMinutes = SLOT_STEP_MINUTES,
  minStartMinutes = 0,
}) {
  if (!planning || !planning.is_working || fullDayException) {
    return [];
  }

  let windows = buildWindows(planning);

  for (const exc of partialExceptions) {
    windows = subtractInterval(windows, [parseTimeToMinutes(exc.start_time), parseTimeToMinutes(exc.end_time)]);
  }

  const expandedBusy = busyIntervals.map(([start, end]) => [start - bufferMinutes, end + bufferMinutes]);

  const slots = [];

  for (const [windowStart, windowEnd] of windows) {
    let candidate = Math.ceil(Math.max(windowStart, minStartMinutes) / slotStepMinutes) * slotStepMinutes;

    while (candidate + serviceDurationMinutes <= windowEnd) {
      const candidateEnd = candidate + serviceDurationMinutes;
      const overlaps = expandedBusy.some(([bStart, bEnd]) => candidate < bEnd && candidateEnd > bStart);

      if (!overlaps) {
        slots.push({ start: minutesToTime(candidate), end: minutesToTime(candidateEnd) });
      }

      candidate += slotStepMinutes;
    }
  }

  return slots;
}

module.exports = { computeAvailableSlots, buildWindows, subtractInterval };
