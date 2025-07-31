module.exports = {
  name: "notify",
  description: "Reenvía un mensaje con menciones invisibles al grupo",
  commands: ["n", "completen"],
  usage: ".n escribe un mensaje o responde a uno",
  groupOnly: true,
  adminOnly: true,

  handle: async ({ socket, remoteJid, fullArgs, quoted, participants }) => {
    try {
      const texto = fullArgs.trim() || quoted?.trim() || "";

      if (!texto) {
        throw new Error("✏️ Escribe un mensajito o responde a uno, no me hagas trabajar en vano.");
      }

      const mentions = participants
        .filter(p => p.id && !p.id.includes("g.us"))
        .map(p => p.id);

      await socket.sendMessage(remoteJid, {
        text: `🕶️ ${texto}`,
        mentions,
      });

    } catch (err) {
      console.error("❌ Error en notify.js:", err);

      await socket.sendMessage(remoteJid, {
        text:
          `🚨 *Falló el llamado, bro...*\n\n` +
          `📛 *Razón:* ${err.message}\n` +
          `💡 Intenta con: *.n Aquí va tu mensaje* o responde a uno.`,
      });
    }
  },
};
