const config = require("./config/env");
const app = require("./app");

app.listen(config.port, () => {
  console.log(`Serveur démarré sur le port ${config.port} (${config.nodeEnv})`);
});
