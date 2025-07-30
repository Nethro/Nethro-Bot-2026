const { PREFIX, BOT_NUMBER, OWNER_NUMBER } = require(`${BASE_DIR}/config`);
const { toUserJid, onlyNumbers } = require(`${BASE_DIR}/utils`);
const { DangerError, InvalidParameterError } = require(`${BASE_DIR}/errors`);

const frasesDespedida = [
  "🚪 Que te vaya bonito, pero bien lejos 😌",
  "👟 Y voló... directo pa' fuera del grupo 💨",
  "🧹 Limpieza completada. Otro menos 😏",
  "📤 Fue un gusto... pero no mucho 🙃",
  "🔥 ¡Expulsado con estilo! No más dramas ✌️",
  "📦 Tu presencia fue... innecesaria 🤷‍♂️"
];

module.exports = {
  name: "kick",
  description: "💣 Saca a alguien del grupo con flow 🔥",
  commands: ["kick", "fuera"],
  usage: `${PREFIX}kick @usuario o respondiendo un mensaje`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    isReply,
    replyJid,
    userJid,
    socket,
    remoteJid,
    isLid,
    sendReply,
    sendSuccessReact,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError("👀 Bro, menciona a alguien o responde su mensaje para darle la patada.");
    }

    let targetId = null;

    if (isLid) {
      const [result] = await socket.onWhatsApp(onlyNumbers(args[0]));
      if (!result) {
        throw new InvalidParameterError("📵 Ese número no existe en WhatsApp, intenta con otro.");
      }
      targetId = result.lid;
    } else {
      const jid = isReply ? replyJid : toUserJid(args[0]);
      const number = onlyNumbers(jid);

      if (jid === userJid) throw new DangerError("🪞 Bro, no te puedes kickear a ti mismo. Respira...");
      if (number === OWNER_NUMBER) throw new DangerError("🛑 ¿Estás loco? ¡Ese es el papá del bot!");
      if (jid === toUserJid(BOT_NUMBER)) throw new DangerError("🤖 Yo soy el bot, ¿cómo me vas a sacar? 😤");

      targetId = jid;
    }

    await socket.groupParticipantsUpdate(remoteJid, [targetId], "remove");
    await sendSuccessReact();

    const fraseRandom = frasesDespedida[Math.floor(Math.random() * frasesDespedida.length)];
    await sendReply(fraseRandom);
  },
};
