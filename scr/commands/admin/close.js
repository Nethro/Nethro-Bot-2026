const { PREFIX } = require(`${BASE_DIR}/config`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "close",
  description: "🔒 Cierra el grupo como un jefe.",
  commands: ["close", "close-group", "cerrar"],
  usage: `${PREFIX}close`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, remoteJid, sendSuccessReply, sendErrorReply }) => {
    try {
      await socket.groupSettingUpdate(remoteJid, "announcement");

      const frasesConFlow = [
        "🚪 ¡Puerta cerrada! El chisme se terminó 😌",
        "🔇 Silencio, esto ya no es democracia 🛑",
        "🔒 Cerrado con broche de oro. Solo habla la élite 💬👑",
        "👊 Se acabó la joda. El admin habló.",
        "💼 Cerrado por mantenimiento... o por drama 🙃"
      ];

      const frase = frasesConFlow[Math.floor(Math.random() * frasesConFlow.length)];
      await sendSuccessReply(frase);
    } catch (error) {
      await sendErrorReply("⚠️ ¡Necesito ser admin para cerrar el grupo, bro!");
      errorLog(
        `🚫 Error al cerrar grupo: ${JSON.stringify(error, null, 2)}`
      );
    }
  },
};
