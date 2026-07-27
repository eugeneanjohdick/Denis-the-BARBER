const airtableClient = require("./airtableClient");

async function findClientByPhone(phone) {
  const records = await airtableClient.list("Clients", {
    filterByFormula: `{phone_whatsapp} = "${phone}"`,
    maxRecords: 1,
  });
  return records[0] || null;
}

async function createClient(phone) {
  const [record] = await airtableClient.batchCreate("Clients", [
    { phone_whatsapp: phone, phone_verified: true },
  ]);
  return record;
}

async function findOrCreateClientByPhone(phone) {
  const existing = await findClientByPhone(phone);
  if (existing) return existing;
  return createClient(phone);
}

module.exports = { findClientByPhone, createClient, findOrCreateClientByPhone };
