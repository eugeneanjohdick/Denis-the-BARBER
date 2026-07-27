const config = require("../config/env");

const GRAPH_API_VERSION = "v20.0";

async function sendTemplateMessage(to, templateName, languageCode, components) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${config.metaWhatsapp.phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.metaWhatsapp.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        ...(components ? { components } : {}),
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.error?.message || "Échec de l'envoi WhatsApp");
    err.metaError = data;
    throw err;
  }
  return data;
}

module.exports = { sendTemplateMessage };
