const Airtable = require("airtable");
const config = require("../config/env");

Airtable.configure({ apiKey: config.airtable.apiKey });
const base = Airtable.base(config.airtable.baseId);

let callCount = 0;
const trackedSince = new Date();

function trackCall() {
  callCount += 1;
}

function getCallStats() {
  return { callCount, trackedSince };
}

function flattenRecord(record) {
  return { id: record.id, ...record.fields };
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function list(table, { filterByFormula, fields, maxRecords, view } = {}) {
  return new Promise((resolve, reject) => {
    const records = [];
    const selectOpts = {};
    if (filterByFormula) selectOpts.filterByFormula = filterByFormula;
    if (fields) selectOpts.fields = fields;
    if (maxRecords) selectOpts.maxRecords = maxRecords;
    if (view) selectOpts.view = view;

    base(table)
      .select(selectOpts)
      .eachPage(
        (pageRecords, fetchNextPage) => {
          trackCall();
          pageRecords.forEach((r) => records.push(flattenRecord(r)));
          fetchNextPage();
        },
        (err) => {
          if (err) return reject(err);
          resolve(records);
        }
      );
  });
}

async function getById(table, id) {
  trackCall();
  const record = await base(table).find(id);
  return flattenRecord(record);
}

async function batchCreate(table, recordsFields) {
  const created = [];
  for (const c of chunk(recordsFields, 10)) {
    trackCall();
    const result = await base(table).create(
      c.map((fields) => ({ fields })),
      { typecast: true }
    );
    result.forEach((r) => created.push(flattenRecord(r)));
  }
  return created;
}

async function batchUpdate(table, recordsWithIdAndFields) {
  const updated = [];
  for (const c of chunk(recordsWithIdAndFields, 10)) {
    trackCall();
    const result = await base(table).update(c, { typecast: true });
    result.forEach((r) => updated.push(flattenRecord(r)));
  }
  return updated;
}

module.exports = { list, getById, batchCreate, batchUpdate, getCallStats };
