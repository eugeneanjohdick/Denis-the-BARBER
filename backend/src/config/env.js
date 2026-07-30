require("dotenv").config();

const REQUIRED_VARS = [
  "AIRTABLE_API_KEY",
  "AIRTABLE_BASE_ID",
  "JWT_SECRET",
  "META_WHATSAPP_TOKEN",
  "META_WHATSAPP_PHONE_NUMBER_ID",
];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Variables d'environnement manquantes : ${missing.join(", ")}. Copie .env.example vers .env et renseigne les valeurs.`
  );
}

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  airtable: {
    apiKey: process.env.AIRTABLE_API_KEY,
    baseId: process.env.AIRTABLE_BASE_ID,
  },
  jwtSecret: process.env.JWT_SECRET,
  metaWhatsapp: {
    token: process.env.META_WHATSAPP_TOKEN,
    phoneNumberId: process.env.META_WHATSAPP_PHONE_NUMBER_ID,
    otpTemplateName: process.env.META_WHATSAPP_OTP_TEMPLATE_NAME || "hello_world",
    otpTemplateLang: process.env.META_WHATSAPP_OTP_TEMPLATE_LANG || "en_US",
  },
  // Contournement temporaire (test terrain pendant le blocage Meta) : liste vide/absente
  // par defaut = mecanisme totalement inactif, comportement normal pour tout le monde.
  // Voir project_pre_production_todo en Memory - a vider avant tout lancement reel.
  otpBypassPhones: (process.env.OTP_BYPASS_PHONES || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean),
};

module.exports = config;
