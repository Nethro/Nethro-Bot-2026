/**
 * Desarrollado por: Mkg
 * Refactorizado con flow por: Roneth Bartra
 */

const { exec } = require("child_process");
const { isBotOwner } = require(`${BASE_DIR}/middlewares`);
const { PREFIX } = require(`${BASE_DIR}/config`);
const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "exec",
  description: "💻 Ejecuta comandos de la terminal como todo un crack del sistema.",
  commands: ["exec"],
  usage: `${PREFIX}exec <comando>`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    fullArgs,
    sendSuccessReply,
    sendErrorReply,
    userJid,
    isLid,
  }) => {
    if (!isBotOwner({ userJid, isLid })) {
      throw new DangerError("🚨 Este comando es 🔒 exclusivo del dueño del bot. Acceso denegado.");
    }

    if (!fullArgs) {
      throw new DangerError(`❗Uso correcto: ${PREFIX}exec <comando>`);
    }

    exec(fullArgs, (error, stdout, stderr) => {
      if (error) {
        return sendErrorReply(`💥 Error al ejecutar:\n\`\`\`\n${error.message}\n\`\`\``);
      }

      const output = stdout || stderr || "✅ Comando ejecutado sin salida.";
      const slicedOutput = output.trim().slice(0, 4000); // WhatsApp límite

      return sendSuccessReply(`📥 Resultado:\n\`\`\`\n${slicedOutput}\n\`\`\``);
    });
  },
};
