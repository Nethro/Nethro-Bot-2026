const { registerGroupMessage } = require("../utils/database");
const dynamicCommand = require("../utils/dynamicCommand");

module.exports = async (sock, messageUpdate) => {
  const messages = messageUpdate.messages;

  for (const message of messages) {
    if (!message.message || message.key.fromMe) continue;

    const remoteJid = message.key.remoteJid;
    const isGroup = remoteJid.endsWith("@g.us");
    const sender = isGroup ? message.key.participant : message.key.remoteJid;

    // Registrar la actividad del usuario en el grupo
    if (isGroup) {
      registerGroupMessage(remoteJid, sender);
    }

    // Ejecutar comandos del bot
    await dynamicCommand(sock, message);
  }
};
