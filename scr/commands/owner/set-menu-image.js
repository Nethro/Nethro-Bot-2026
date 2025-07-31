const fs = require("node:fs");
const path = require("node:path");
const { errorLog } = require(`${BASE_DIR}/utils/logger`);
const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "set-menu-image",
  description: "🖼️ Cambia la imagen del menú del bot. Dale flow visual al menú 😎",
  commands: ["set-menu-image", "set-image", "set-img-menu", "set-menu-img"],
  usage: `${PREFIX}set-menu-image (responde a una imagen)`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    isImage,
    isReply,
    downloadImage,
    sendSuccessReply,
    sendErrorReply,
    webMessage,
  }) => {
    if (!isReply || !isImage) {
      throw new InvalidParameterError("⚠️ Bro, tienes que responder a una imagen para poder cambiar el menú 😅");
    }

    try {
      const menuImagePath = path.join(ASSETS_DIR, "images", "nethro-bot.png");

      // Backup por si acaso
      let backupPath = "";

      if (fs.existsSync(menuImagePath)) {
        backupPath = path.join(ASSETS_DIR, "images", "nethro-bot-backup.png");
        fs.copyFileSync(menuImagePath, backupPath);
      }

      // Descargamos la nueva imagen temporalmente
      const tempPath = await downloadImage(webMessage, "new-menu-image-temp");

      // Reemplazamos la anterior
      if (fs.existsSync(menuImagePath)) {
        fs.unlinkSync(menuImagePath);
      }

      fs.renameSync(tempPath, menuImagePath);

      await sendSuccessReply("✅ ¡Menú actualizado! Ahora sí tiene más estilo que nunca 😎🖼️");
    } catch (error) {
      errorLog(`💥 Error al cambiar la imagen del menú: ${error}`);
      await sendErrorReply("🚫 Algo salió mal al intentar cambiar la imagen. Intenta otra vez, bro.");
    }
  },
};
