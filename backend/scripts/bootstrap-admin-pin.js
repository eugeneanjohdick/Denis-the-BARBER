// Usage : node scripts/bootstrap-admin-pin.js <login_username> <pin>
// A executer localement, jamais expose en HTTP.

const bcrypt = require("bcryptjs");
const airtableClient = require("../src/services/airtableClient");

async function main() {
  const [username, pin] = process.argv.slice(2);

  if (!username || !pin) {
    console.error("Usage : node scripts/bootstrap-admin-pin.js <login_username> <pin>");
    process.exit(1);
  }

  const staff = await airtableClient.list("Coiffeurs", {
    filterByFormula: `{login_username} = "${username}"`,
    maxRecords: 1,
  });

  if (staff.length === 0) {
    console.error(`Aucun coiffeur trouvé avec login_username = "${username}"`);
    process.exit(1);
  }

  const pinHash = await bcrypt.hash(pin, 10);
  await airtableClient.batchUpdate("Coiffeurs", [{ id: staff[0].id, fields: { pin_hash: pinHash } }]);

  console.log(`PIN mis à jour pour ${username} (${staff[0].full_name}).`);
}

main();
