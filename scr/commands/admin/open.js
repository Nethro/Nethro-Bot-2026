const { PREFIX } = require(`${BASE_DIR}/config`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "open",
  description: "🔓 Abre el grupo con estilo pa' que hablen todos.",
  commands: ["open", "open-group", "abrir"],
  usage: `${PREFIX}open`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, remoteJid, sendSuccessReply, sendErrorReply }) => {
    try {
      await socket.groupSettingUpdate(remoteJid, "not_announcement");

      const frasesConEstilo = [
        "📢 ¡A hablar se ha dicho! El grupo fue abierto 🚀",
        "🗣️ Ya pueden soltar la lengua, que esto está libre 💬🔥",
        "👀 ¡Ojito! Se abrieron los micrófonos 🎤",
        "😏 Ya pueden chismear, pero con respeto 😎",
        "🛑 Se acabó la dictadura, ahora todos hablan... por ahora 😜"
      ];

      const frase = frasesConEstilo[Math.floor(Math.random() * frasesConEstilo.length)];
      await sendSuccessReply(frase);
    } catch (error) {
      await sendErrorReply("⚠️ ¡Necesito ser admin para abrir el grupo, bro!");
      errorLog(
        `🚫 Error al abrir grupo: ${JSON.stringify(error, null, 2)}`
      );
    }
  },
};
