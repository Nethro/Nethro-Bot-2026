const { PREFIX } = require(`${BASE_DIR}/config`);
const { activateGroup } = require(`${BASE_DIR}/utils/database`);
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "on",
  description: "🟢 Activa al Nethro-Bot en este grupo. ¡Que empiece la fiesta! 🎉",
  commands: ["on"],
  usage: `${PREFIX}on`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendSuccessReply, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("⚠️ Este comando solo sirve en grupos, bro. No seas tímido 😅");
    }

    activateGroup(remoteJid);

    await sendSuccessReply("✅ ¡Activado con toda la actitud! Nethro-Bot está listo pa' lo que venga 💪🔥");
  },
};
