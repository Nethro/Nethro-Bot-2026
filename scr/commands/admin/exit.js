const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const {
  activateExitGroup,
  deactivateExitGroup,
  isActiveExitGroup,
  setExitMessage,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "exit",
  description: "👋 Activa/desactiva o personaliza el mensaje de despedida para los que abandonan el grupo.",
  commands: ["exit"],
  usage: `${PREFIX}exit (1/0)\n${PREFIX}exit set Tu mensaje con {user}`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "📛 Escribe `1` para activar, `0` para apagar o `set` para personalizar el mensaje."
      );
    }

    const modo = args[0];

    // Personalizar mensaje
    if (modo === "set") {
      const mensaje = args.slice(1).join(" ").trim();

      if (!mensaje) {
        throw new InvalidParameterError("✍️ Escribe un mensaje después de `set`.");
      }

      await setExitMessage(remoteJid, mensaje);
      await sendSuccessReact("✅");
      return await sendReply("💬 Mensaje de despedida personalizado con éxito. El que se va… se va con flow 🕶️");
    }

    // Activar o desactivar
    const activar = modo === "1";
    const desactivar = modo === "0";

    if (!activar && !desactivar) {
      throw new InvalidParameterError("❗Solo se acepta `1`, `0` o `set`.");
    }

    const yaActivo = activar && isActiveExitGroup(remoteJid);
    const yaInactivo = desactivar && !isActiveExitGroup(remoteJid);

    if (yaActivo || yaInactivo) {
      throw new WarningError(`⚠️ El modo despedida ya está ${activar ? "encendido 🔥" : "apagado 💤"}`);
    }

    if (activar) {
      activateExitGroup(remoteJid);
    } else {
      deactivateExitGroup(remoteJid);
    }

    await sendSuccessReact("✅");

    const estado = activar ? "activado 💌" : "desactivado 📴";

    await sendReply(`✅ Modo despedida ${estado} con éxito. Ahora el que se va… ¡se va con estilo! 😎`);
  },
};


