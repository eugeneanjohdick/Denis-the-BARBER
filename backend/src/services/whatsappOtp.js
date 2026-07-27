const { sendTemplateMessage } = require("./whatsapp");
const config = require("../config/env");

async function sendOtpCode(phone, code) {
  const templateName = config.metaWhatsapp.otpTemplateName;
  const languageCode = config.metaWhatsapp.otpTemplateLang;

  // hello_world (template par defaut, sans approbation) n'a pas de variable :
  // le vrai code n'apparaitra dans le message qu'une fois un template
  // Authentication approuve configure via META_WHATSAPP_OTP_TEMPLATE_NAME.
  const components =
    templateName === "hello_world"
      ? undefined
      : [{ type: "body", parameters: [{ type: "text", text: code }] }];

  return sendTemplateMessage(phone, templateName, languageCode, components);
}

module.exports = { sendOtpCode };
