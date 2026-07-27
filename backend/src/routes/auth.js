const express = require("express");
const config = require("../config/env");
const { createOtp, verifyOtp } = require("../services/otpStore");
const { sendOtpCode } = require("../services/whatsappOtp");
const { findOrCreateClientByPhone } = require("../services/clients");
const { signToken } = require("../services/tokens");
const { createRateLimiter } = require("../middlewares/rateLimit");

const router = express.Router();

const PHONE_REGEX = /^\+[1-9][0-9]{7,14}$/;

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

router.post("/otp/request", otpRequestLimiter, async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone || !PHONE_REGEX.test(phone)) {
      return res.status(400).json({ error: "Numéro invalide (format attendu : +237XXXXXXXXX)" });
    }

    const code = createOtp(phone);
    if (config.nodeEnv === "development") {
      console.log(`[dev] Code OTP pour ${phone} : ${code}`);
    }

    await sendOtpCode(phone, code);

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

module.exports = router;
