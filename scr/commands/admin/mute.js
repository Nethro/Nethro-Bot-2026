/**
 * Desenvolvido por: Mkg
 * Refatorado por: Dev Gui
 * Rediseñado con flow por: Nethro 🐍
 */

const { toUserJid, onlyNumbers } = require(`${BASE_DIR}/utils`);
const {
  checkIfMemberIsMuted,
  muteMember,
} = require(`${BASE_DIR}/utils/database`);
const {
  PREFIX,
  BOT_NUMBER,
  OWNER_NUMBER,
  OWNER_LID,
} = require(`${BASE_DIR}/config`);

const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "mute",
  description: "🔇 Silencia a ese loquillo que no para de hablar en el grupo.",
  commands: ["mute", "mutar", "callate"],
  usage: `${PREFIX}mute @usuario (o responde al mensaje de quien quieres silenciar)`,

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
      throw new DangerError("📵 Bro, este comando solo se usa en grupos.");
    }

    if (!args.length && !replyJid) {
      throw new DangerError(
        `😴 Tienes que mencionar o responder al que quieres silenciar.\n\nEjemplo: ${PREFIX}mute @fulano`
      );
    }

    const targetUserNumber = args.length
      ? onlyNumbers(args[0])
      : isGroupWithLid
      ? replyJid
      : onlyNumbers(replyJid);

    if ([OWNER_NUMBER, OWNER_LID].includes(targetUserNumber)) {
      throw new DangerError("🚫 ¡Ni se te ocurra mutear al dueño del bot!");
    }

    const targetUserJid = isGroupWithLid
      ? targetUserNumber
      : toUserJid(targetUserNumber);

    if (targetUserJid === toUserJid(BOT_NUMBER)) {
      throw new DangerError("😒 ¿Mutearme a mí? ¡Qué atrevido!");
    }

    const [result] =
      replyJid && isGroupWithLid
        ? [{ jid: targetUserJid, lid: targetUserJid }]
        : await socket.onWhatsApp(targetUserNumber);

    if (result.jid === userJid) {
      throw new DangerError("🪞 No puedes silenciarte a ti mismo, bro.");
    }

    const groupMetadata = await getGroupMetadata();

    const isUserInGroup = groupMetadata.participants.some(
      (participant) => participant.id === targetUserJid
    );

    if (!isUserInGroup) {
      return sendErrorReply(
        `👻 El usuario @${targetUserNumber} no está en el grupo.`,
        [targetUserJid]
      );
    }

    const isTargetAdmin = groupMetadata.participants.some(
      (participant) => participant.id === targetUserJid && participant.admin
    );

    if (isTargetAdmin) {
      throw new DangerError("🛡️ No puedes mutear a un admin, calmado capo.");
    }

    if (checkIfMemberIsMuted(remoteJid, targetUserJid)) {
      return sendErrorReply(
        `🔇 El usuario @${targetUserNumber} ya estaba silenciado, bro.`,
        [targetUserJid]
      );
    }

    muteMember(remoteJid, targetUserJid);

    const frasesMute = [
      `🤫 ¡Shhh! @${targetUserNumber} fue callado por bocón.`,
      `🔕 @${targetUserNumber} se quedó sin micro... por hablador 😏`,
      `📴 Micrófono apagado para @${targetUserNumber}, respeta el orden del grupo.`,
      `💤 Ya era hora de silenciar a @${targetUserNumber}, gracias.`,
      `🎙️ Silenciado con estilo: @${targetUserNumber} fuera del aire.`
    ];

    const frase = frasesMute[Math.floor(Math.random() * frasesMute.length)];

    await sendSuccessReply(frase, [targetUserJid]);
  },
};
