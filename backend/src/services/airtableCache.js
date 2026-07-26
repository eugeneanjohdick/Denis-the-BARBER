const airtableClient = require("./airtableClient");
const cache = require("./cache");

const DEFAULT_TTL_MS = 20 * 60 * 1000;

async function cachedList(table, opts = {}, ttlMs = DEFAULT_TTL_MS) {
  const cacheKey = `${table}:${JSON.stringify(opts)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const records = await airtableClient.list(table, opts);
  cache.set(cacheKey, records, ttlMs);
  return records;
}

module.exports = { cachedList, invalidateTable: cache.invalidateTable };
