const store = new Map();

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createOtp(phone, fixedCode) {
  const code = fixedCode || generateCode();
  store.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
  return code;
}

function verifyOtp(phone, code) {
  const entry = store.get(phone);
  if (!entry) return { valid: false, reason: "not_found" };

  if (Date.now() > entry.expiresAt) {
    store.delete(phone);
    return { valid: false, reason: "expired" };
  }

  entry.attempts += 1;
  if (entry.attempts > MAX_ATTEMPTS) {
    store.delete(phone);
    return { valid: false, reason: "too_many_attempts" };
  }

  if (entry.code !== code) {
    return { valid: false, reason: "mismatch" };
  }

  store.delete(phone);
  return { valid: true };
}

module.exports = { createOtp, verifyOtp };
