const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const {
  activateAutoResponderGroup,
  deactivateAutoResponderGroup,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "auto-responder",
  description: "🤖 Enciende o apaga la fiera de las auto-respuestas en el grupo.",
  commands: ["auto-responder"],
  usage: `${PREFIX}auto-responder (1/0)`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError("📛 Escribe `1` para encender o `0` para apagar, crack.");
    }

    const activar = args[0] === "1";
    const desactivar = args[0] === "0";

    if (!activar && !desactivar) {
      throw new InvalidParameterError("⚠️ Solo se acepta `1` (ON) o `0` (OFF), nada raro bro.");
    }

    if (activar) {
      activateAutoResponderGroup(remoteJid);
    } else {
      deactivateAutoResponderGroup(remoteJid);
    }

    await sendSuccessReact("✅");

    const estado = activar ? "🔥 ACTIVADA" : "💤 DESACTIVADA";

    await sendReply(`✅ Auto-respuesta ${estado} con éxito, ahora sí a romperla como se debe 😎`);
  },
};

