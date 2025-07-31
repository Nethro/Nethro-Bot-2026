const { PREFIX } = require(`${BASE_DIR}/config`);
const { deactivateGroup } = require(`${BASE_DIR}/utils/database`);
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "off",
  description: "🔇 Desactiva al Nethro-Bot en el grupo. Se va de vacaciones... por ahora 😌",
  commands: ["off"],
  usage: `${PREFIX}off`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendSuccessReply, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningEr
