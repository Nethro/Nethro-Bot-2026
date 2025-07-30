const { OWNER_NUMBER } = require("../../config");
const { PREFIX, BOT_NUMBER } = require(`${BASE_DIR}/config`);
const { DangerError, InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { toUserJid, onlyNumbers } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "ban",
  description: "Expulsa a un miembro del grupo sin pedir permiso 😎",
  commands: ["ban", "kick"],
  usage: `${PREFIX}ban @usuario

o también:

${PREFIX}ban (respondiendo al mensaje del usuario)`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    isLid,
    sendSuccessReact,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "👀 Bro, menciona o responde a alguien que quieras banear."
      );
    }

    let memberToRemoveId = null;

    if (isLid) {
      const [result] = await socket.onWhatsApp(onlyNumbers(args[0]));

      if (!result) {
        throw new WarningError(
          "📵 Ese número ni siquiera tiene WhatsApp, crack."
        );
      }

      memberToRemoveId = result.lid;
    } else {
      const memberToRemoveJid = isReply ? replyJid : toUserJid(args[0]);
      const memberToRemoveNumber = onlyNumbers(memberToRemoveJid);

      if (memberToRemoveNumber.length < 7 || memberToRemoveNumber.length > 15) {
        throw new InvalidParameterError("❌ Ese número no cuadra, intenta de nuevo.");
      }

      if (memberToRemoveJid === userJid) {
        throw new DangerError("😵 ¿Auto-ban? Mejor tómate un respiro, bro.");
      }

      if (memberToRemoveNumber === OWNER_NUMBER) {
        throw new DangerError("🚫 Ni se te ocurra banear al dueño, loco.");
      }

      const botJid = toUserJid(BOT_NUMBER);
      if (memberToRemoveJid === botJid) {
        throw new DangerError("😒 ¿Intentas banearme a mí? Qué feo tu caso.");
      }

      memberToRemoveId = memberToRemoveJid;
    }

    await socket.groupParticipantsUpdate(remoteJid, [memberToRemoveId], "remove");

    await sendSuccessReact();
    await sendReply("✅ El pana fue baneado del grupo. ¡A otra cosa, mariposa!");
  },
};
