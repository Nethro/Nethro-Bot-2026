const { PREFIX } = require(`${BASE_DIR}/config`);
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "get-id",
  description: "🆔 Muestra el ID completo del grupo (JID), ideal para configuraciones avanzadas.",
  commands: ["get-id", "get-group-id", "id-get", "id-group"],
  usage: `${PREFIX}get-id`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, sendSuccessReply, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("⚠️ Este comando solo se puede usar dentro de un grupo. No te me aceleres 🤨");
    }

    await sendSuccessReply(`📌 *ID del grupo:* \n\`\`\`${remoteJid}\`\`\``);
  },
};
