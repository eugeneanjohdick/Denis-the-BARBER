const express = require("express");
const { cachedList } = require("../services/airtableCache");

const router = express.Router();

function toPublicService(record) {
  return {
    id: record.id,
    name_fr: record.name_fr,
    name_en: record.name_en,
    description_fr: record.description_fr,
    description_en: record.description_en,
    duration_minutes: record.duration_minutes,
    price_fcfa: record.price_fcfa,
    photo_url: record.photo?.[0]?.thumbnails?.large?.url ?? null,
  };
}

router.get("/", async (req, res, next) => {
  try {
    const services = await cachedList("Services");
    res.status(200).json(services.map(toPublicService));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
