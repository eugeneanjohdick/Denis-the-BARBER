const express = require("express");
const { cachedList } = require("../services/airtableCache");

const router = express.Router();

function toPublicStaff(record) {
  return {
    id: record.id,
    full_name: record.full_name,
    specialty_fr: record.specialty_fr,
    specialty_en: record.specialty_en,
    photo_url: record.photo?.[0]?.thumbnails?.large?.url ?? null,
  };
}

router.get("/", async (req, res, next) => {
  try {
    const staff = await cachedList("Coiffeurs");
    res.status(200).json(staff.map(toPublicStaff));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
