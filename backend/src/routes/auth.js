const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("../config/env");
const { createOtp, verifyOtp } = require("../services/otpStore");
const { sendOtpCode } = require("../services/whatsappOtp");
const { findOrCreateClientByPhone } = require("../services/clients");
const { findStaffByUsername } = require("../services/staff");
const { signToken } = require("../services/tokens");
const { createRateLimiter } = require("../middlewares/rateLimit");

const router = express.Router();

const PHONE_REGEX = /^\+[1-9][0-9]{7,14}$/;

// Contournement temporaire (test terrain pendant le blocage Meta) : le code
// n'est pas sensible en soi (il est destine a etre connu a l'avance par les
// numeros listes dans OTP_BYPASS_PHONES) - seule la liste des numeros doit
// rester pilotee par variable d'environnement, jamais codee en dur.
const OTP_BYPASS_CODE = "123456";

const otpRequestLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Trop de demandes de code, réessaie dans quelques minutes.",
});

const otpVerifyLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Trop de tentatives, réessaie dans quelques minutes.",
});

const adminLoginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Trop de tentatives de connexion, réessaie dans quelques minutes.",
});

router.post("/otp/request", otpRequestLimiter, async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone || !PHONE_REGEX.test(phone)) {
      return res.status(400).json({ error: "Numéro invalide (format attendu : +237XXXXXXXXX)" });
    }

    const isBypassPhone = config.otpBypassPhones.includes(phone);
    const code = createOtp(phone, isBypassPhone ? OTP_BYPASS_CODE : undefined);

    if (config.nodeEnv === "development") {
      console.log(`[dev] Code OTP pour ${phone} : ${code}`);
    }

    if (!isBypassPhone) {
      await sendOtpCode(phone, code);
    }

    res.status(200).json({ status: "sent" });
  } catch (err) {
    next(err);
  }
});

router.post("/otp/verify", otpVerifyLimiter, async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ error: "Numéro et code requis" });
    }

    const result = verifyOtp(phone, code);
    if (!result.valid) {
      return res.status(401).json({ error: "Code invalide ou expiré" });
    }

    const client = await findOrCreateClientByPhone(phone);
    const token = signToken({ sub: client.id, role: "client" });

    res.status(200).json({ token, client: { id: client.id, phone: client.phone_whatsapp } });
  } catch (err) {
    next(err);
  }
});

router.post("/admin/login", adminLoginLimiter, async (req, res, next) => {
  try {
    const { username, pin } = req.body;
    if (!username || !pin) {
      return res.status(400).json({ error: "Identifiant et PIN requis" });
    }

    const staff = await findStaffByUsername(username);
    if (!staff || !staff.pin_hash || !staff.is_admin) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const match = await bcrypt.compare(pin, staff.pin_hash);
    if (!match) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const adminLevel = staff.role === "Gérant" ? "manager" : "staff";
    const token = signToken({ sub: staff.id, role: "admin", adminLevel }, "7d");
    res.status(200).json({
      token,
      staff: { id: staff.id, full_name: staff.full_name, role: staff.role, adminLevel },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
