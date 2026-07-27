const { cachedList, invalidateTable } = require("./airtableCache");

async function findStaffByUsername(username) {
  const staff = await cachedList("Coiffeurs");
  return staff.find((s) => s.login_username === username) || null;
}

function invalidateStaffCache() {
  invalidateTable("Coiffeurs");
}

module.exports = { findStaffByUsername, invalidateStaffCache };
