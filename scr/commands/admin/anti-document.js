const {
  updateIsActiveGroupRestriction,
  isActiveGroupRestriction,
} = require(`${BASE_DIR}/utils/database`);

const { WarningError } = require(`${BASE_DIR}/errors`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "anti-document",
  description:
    "🛡️ Activa o desactiva el modo anti-documento en el grupo. Si está activo, ¡pum! se elimina todo doc que manden.",
  commands: ["anti-document", "anti-doc", "anti-documento", "anti-documentos"],
  usage: `${PREFIX}anti-document (1/0)`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("🚫 Este comando solo se puede usar en grupos, bro.");
    }

    if (!args.length) {
      throw new WarningError("📛 Tienes que poner `1` para encender o `0` para apagar.");
    }

    const modoOn = args[0] === "1";
    const modoOff = args[0] === "0";

    if (!modoOn && !modoOff) {
      throw new WarningError("⚠️ Oye, solo vale `1` o `0`, nada más.");
    }

    const yaActivo = modoOn && isActiveGroupRestriction(remoteJid, "anti-document");
    const yaInactivo = modoOff && !isActiveGroupRestriction(remoteJid, "anti-document");

    if (yaActivo || yaInactivo) {
      throw new WarningError(
        `🔁 El modo anti-documento ya estaba ${modoOn ? "encendido 🔥" : "apagado 💤"}`
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-document", modoOn);

    const estado = modoOn ? "🟢 activado" : "🔴 desactivado";

    await sendSuccessReply(`✅ Modo anti-documento ${estado} con éxito, papi 😎`);
  },
};

    const status = antiDocumentOn ? "activada" : "desactivada";

    await sendSuccessReply(`¡Anti-documento ${status} con éxito!`);
  },
};
