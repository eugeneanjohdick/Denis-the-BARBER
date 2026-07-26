const store = new Map();

function get(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

function set(key, value, ttlMs) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function invalidate(key) {
  store.delete(key);
}

function invalidateTable(table) {
  for (const key of store.keys()) {
    if (key.startsWith(`${table}:`)) store.delete(key);
  }
}

module.exports = { get, set, invalidate, invalidateTable };
