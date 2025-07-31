const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const {
  isActiveWelcomeGroup,
  activateWelcomeGroup,
  deactivateWelcomeGroup,
  setWelcomeMessage,
  getWelcomeMessage,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "welcome",
  description: "🎊 Activa, desactiva o personaliza el mensaje de bienvenida para nuevos miembros.",
  commands: ["welcome"],
  usage: `${PREFIX}welcome (1/0)\n${PREFIX}welcome set Tu mensaje con {user}`,

  /**
   * Manejador de comando .welcome
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError("📛 Usa `1` para activar, `0` para apagar o `set` para personalizar el mensaje.");
    }

    const modo = args[0];

    // Personalizar mensaje
    if (modo === "set") {
      const mensaje = args.slice(1).join(" ").trim();
      if (!mensaje) {
        throw new InvalidParameterError("📝 Escribe un mensaje después de `set`.");
      }
      await setWelcomeMessage(remoteJid, mensaje);
      await sendSuccessReact("✅");
      return await sendReply("📨 Mensaje de bienvenida configurado con flow 😎");
    }

    // Activar o desactivar
    const activar = modo === "1";
    const desactivar = modo === "0";

    if (!activar && !desactivar) {
      throw new InvalidParameterError("⚠️ Solo se acepta `1`, `0` o `set`.");
    }

    const yaActivo = activar && isActiveWelcomeGroup(remoteJid);
    const yaInactivo = desactivar && !isActiveWelcomeGroup(remoteJid);

    if (yaActivo || yaInactivo) {
      throw new WarningError(`🚫 Ya estaba ${activar ? "activado 🔥" : "desactivado 💤"}`);
    }

    if (activar) {
      activateWelcomeGroup(remoteJid);
    } else {
      deactivateWelcomeGroup(remoteJid);
    }

    await sendSuccessReact("✅");
    const estado = activar ? "ACTIVADO 🎉" : "DESACTIVADO 📴";
    await sendReply(`✅ Modo bienvenida ${estado} con éxito, ¡a recibir con estilo! 🕺`);
  },

  /**
   * Listener de nuevos participantes
   * @param {object} param0
   */
  onParticipantAdd: async ({ socket, update }) => {
    const { id: remoteJid, participants, action } = update;

    if (action !== "add") return;

    for (const user of participants) {
      const welcomeOn = isActiveWelcomeGroup(remoteJid);
      if (!welcomeOn) return;

      const mensajePlantilla = getWelcomeMessage(remoteJid) ||
        "🎉 Bienvenido/a {user} al grupo. ¡Pórtate bien o te vas volando! ✈️";

      const tag = `@${user.split("@")[0]}`;
      const mensajeFinal = mensajePlantilla.replace(/{user}/g, tag);

      await socket.sendMessage(remoteJid, {
        text: mensajeFinal,
        mentions: [user],
      });
    }
  },
};
