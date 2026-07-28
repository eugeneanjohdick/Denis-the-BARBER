// Mutex en memoire par cle : serialise les appels concurrents partageant
// la meme cle. Suffisant tant qu'une seule instance du backend tourne
// (cas du tier gratuit Render/Railway, pas de scaling horizontal).
const queues = new Map();

function withLock(key, fn) {
  const tail = queues.get(key) || Promise.resolve();
  const result = tail.then(fn, fn);
  queues.set(key, result.then(() => {}, () => {}));
  return result;
}

module.exports = { withLock };
