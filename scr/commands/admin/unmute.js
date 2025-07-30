/**
 * Desenvolvido por: Mkg
 * Refatorado por: Dev Gui
 * Adaptado con flow por: Nethro Crew 😎🔥
 */

const { toUserJid, onlyNumbers } = require(`${BASE_DIR}/utils`);
const {
  checkIfMemberIsMuted,
  unmuteMember,
} = require(`${BASE_DIR}/utils/database`);
const {
  PREFIX,
  BOT_NUMBER,
  OWNER_NUMBER,
  OWNER_LID,
} = require(`${BASE_DIR}/config`);

const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "unmute",
  description: "Libera a un usuario silenciado pa' que vuelva a tirar flow en el grupo.",
  commands: ["unmute", "desmutar"],
  usage: `${PREFIX}unmute @usuario o responde su mensaje`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    remoteJid,
    replyJid,
    userJid,
    sendErrorReply,
    sendSuccessReply,
    getGroupMetadata,
    socket,
    isGroupWithLid,
    isGroup,
  }) => {
    if (!isGroup) {
      throw new DangerError("Este comando solo sirve en grupos, bro.");
    }

    if (!args.length && !replyJid) {
      throw new DangerError(
        `Tienes que mencionar al usuario o responder su mensaje.\n\nEjemplo: ${PREFIX}unmute @fulanito`
      );
    }

    const targetUserNumber = args.length
      ? onlyNumbers(args[0])
      : isGroupWithLid
      ? replyJid
      : onlyNumbers(replyJid);

    if ([OWNER_NUMBER, OWNER_LID].includes(targetUserNumber)) {
      throw new DangerError("No puedes desmutear al jefe, él siempre tiene voz 😎");
    }

    const targetUserJid = isGroupWithLid
      ? targetUserNumber
      : toUserJid(targetUserNumber);

    if (targetUserJid === toUserJid(BOT_NUMBER)) {
      throw new DangerError("¿Desmutear al bot? Ya estoy hablando, bro 🤖🎤");
    }

    const [result] =
      replyJid && isGroupWithLid
        ? [{ jid: targetUserJid, lid: targetUserJid }]
        : await socket.onWhatsApp(targetUserNumber);

    if (result.jid === userJid) {
      throw new DangerError("¿Desmutearte a ti mismo? Ya estás libre, relájate 😅");
    }

    const groupMetadata = await getGroupMetadata();

    const isUserInGroup = groupMetadata.participants.some(
      (participant) => participant.id === targetUserJid
    );

    if (!isUserInGroup) {
      return sendErrorReply(
        `El usuario @${targetUserNumber} no está en este corral 🐑`,
        [targetUserJid]
      );
    }

    if (!checkIfMemberIsMuted(remoteJid, targetUserJid)) {
      return sendErrorReply(
        `@${targetUserNumber} no está silenciado. Déjalo hablar tranqui 🗣️`,
        [targetUserJid]
      );
    }

    unmuteMember(remoteJid, targetUserJid);

    await sendSuccessReply(
      `@${targetUserNumber} fue desmuteado con éxito. ¡Bienvenido de vuelta al chisme 🔥!`,
      [targetUserJid]
    );
  },
};
