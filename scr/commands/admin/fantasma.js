const { PREFIX } = require(`${BASE_DIR}/config`);
const { getGroupMetadata } = require(`${BASE_DIR}/utils`);
const { getGroupMessageActivity } = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "fantasma",
  description: "Muestra a los más calladitos del grupo 👻",
  commands: ["fantasma", "fantasmas", "topmuertos"],
  usage: `${PREFIX}fantasma`,
  groupOnly: true,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, remoteJid, sendReply }) => {
    const metadata = await socket.groupMetadata(remoteJid);
    const participantes = metadata.participants;
    
    // Trae el registro de actividad por ID de grupo
    const activity = getGroupMessageActivity(remoteJid);

    const conteo = participantes.map(p => {
      const count = activity[p.id] || 0;
      return { id: p.id, count };
    });

    // Ordena por menor actividad
    conteo.sort((a, b) => a.count - b.count);

    const top = conteo.slice(0, 10);
    const mensaje = top.map((u, i) =>
      `*${i + 1}.* @${u.id.split("@")[0]} — _${u.count} mensajes_`
    ).join("\n");

    await sendReply(
      `📢 *Top Fantasmas del grupo 👻*\n\n${mensaje}\n\nLos más calladitos, ¡actívense o les hacemos ouija! 😈`,
      top.map(u => u.id)
    );
  }
};
