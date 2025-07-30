/**
 * 🧠 Plantilla Oficial de Comando - Nethro Bot 2026 💣
 * 
 * ✨ Copia esta joyita y pégala en la carpeta que le corresponde: 
 * - 'owner' si solo el dueño del bot puede usarlo
 * - 'admin' si lo pueden usar los admins del grupo
 * - 'member' si está libre para cualquier integrante del grupo
 * 
 * 🚀 Renómbralo para que tenga sentido con la función que cumple.
 * 
 * ⚙️ Puedes sacar props útiles del handle → están definidos en `src/@types/index.d.ts`
 * (Ej: sendMessage, socket, remoteJid, isGroup, isAdmin, quoted, etc.)
 * 
 * 💡 TIP: ¡Respeta las mayúsculas/minúsculas para evitar bugs raros!
 * 
 * 😎 By: @ronethbartrac x Nethro Project
 */

const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "comando",
  description: "Descripción facherita del comando",
  commands: ["comando1", "comando2"], // Alias o formas de activarlo
  usage: `${PREFIX}comando`,

  /**
   * 🧩 Lógica del comando
   * @param {CommandHandleProps} props - Props disponibles para jugar
   */
  handle: async ({ sendAudioFromBuffer }) => {
    // 🎯 Aquí va la magia del comando
    // Por ejemplo, podrías responder con un audio, imagen, texto o lo que se te ocurra.
  },
};
