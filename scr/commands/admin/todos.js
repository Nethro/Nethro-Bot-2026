const path = require("path");
const BASE_DIR = path.resolve(__dirname, "../../");
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "todos",
  description: "Este comando marcará a todos del grupo con estilo BlazeUp",
  commands: ["mancos", "todos", "todas"],
  usage: `${PREFIX}todos <motivo>`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ fullArgs, sendText, socket, remoteJid, sendReact }) => {
    const groupMetadata = await socket.groupMetadata(remoteJid);
    const participants = groupMetadata.participants;
    const mentions = participants.map(({ id }) => id);

    // 🔥 Elimina el prefijo del mensaje si lo tiene
    const mensajeSinPrefijo = fullArgs
      ?.replace(new RegExp(`^${PREFIX}\\S+\\s*`, "i"), "")
      .trim();

    const mensaje = mensajeSinPrefijo || "‼️𝗔𝗖𝗧𝗜𝗩𝗘𝗡𝗦𝗘‼️";

    // 🎤 Mensaje con flow y picardía
    let texto = "╭─────────┈•\n";
    texto += `│❏ 𝙉𝙚𝙩𝙝𝙧𝙤 𝘽𝙤𝙩 ♦️\n`;
    texto += `│❏ 𝙈𝙞𝙚𝙢𝙗𝙧𝙤𝙨: *${participants.length}*\n`;
    texto += `│❏ ${mensaje}\n│\n`;

    for (const mem of participants) {
      texto += `│Ᏸ↑ @${mem.id.split("@")[0]}\n`;
    }

    texto += "╰──── @𝙧𝙤𝙣𝙚𝙩𝙝𝙗𝙖𝙧𝙩𝙖𝙘 ───┈•";

    await sendReact("📢");
    await sendText(texto, mentions);
  },
};
