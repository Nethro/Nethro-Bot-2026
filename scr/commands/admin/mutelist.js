/**
 * Desenvolvido por: Mkg
 * Refatorado por: Dev Gui
 * Potenciado con flow por: Nethro Crew 😎🔥
 */

const { toUserJid } = require(`${BASE_DIR}/utils`);
const { getMutedMembers } = require(`${BASE_DIR}/utils/database`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "mutelist",
  description: "Muestra a los panas que están en modo silencioso 😶",
  commands: ["mutelist", "callados", "mutados"],
  usage: `${PREFIX}mutelist`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    remoteJid,
    sendReply,
    getGroupMetadata,
  }) => {
    const mutedList = getMutedMembers(remoteJid);
    const metadata = await getGroupMetadata();

    if (!mutedList || mutedList.length === 0) {
      return sendReply("Nadie está callado por aquí, todos andan sueltos 💬🔥");
    }

    let text = `🤐 *Lista de los que están muteados en este grupo:*\n\n`;

    let count = 1;
    for (const mutedJid of mutedList) {
      const participante = metadata.participants.find(p => p.id === mutedJid);
      if (participante) {
        const number = mutedJid.split("@")[0];
        text += `*${count}.* @${number}\n`;
        count++;
      }
    }

    text += `\nSi quieres soltarle la lengua a alguien, usa *${PREFIX}unmute @usuario* 🗣️`;

    await sendReply(text, mutedList);
  },
};
