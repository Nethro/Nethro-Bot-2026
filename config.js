const path = require("path");

/* === ⚙️ CONFIGURACIÓN PRINCIPAL DEL NETHRO BOT === */

// Prefijo que activa los comandos (¡ponle el flow que quieras!)
exports.PREFIX = "✓";

// Emoji representativo del Nethro-Bot
exports.BOT_EMOJI = "⚡";

// Nombre del pana bot
exports.BOT_NAME = "Nethro-Bot-2026";

// Número del bot (como sale en WhatsApp, sin espacios ni +)
exports.BOT_NUMBER = "51963313750";

// Número del creador supremo del bot 🧙‍♂️
exports.OWNER_NUMBER = "51963313750";

// LID (para comandos especiales y control de acceso)
exports.OWNER_LID = "519123456789999@lid";

/* === 📁 RUTAS INTERNAS === */

// Carpeta donde vive cada comando personalizado
exports.COMMANDS_DIR = path.join(__dirname, "commands");

// Base de datos del bot (usuarios, contadores, etc)
exports.DATABASE_DIR = path.resolve(__dirname, "..", "database");

// Carpeta con imágenes, stickers y más
exports.ASSETS_DIR = path.resolve(__dirname, "..", "assets");

// Archivos temporales (audios, conversiones, etc)
exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");

/* === ⏱️ CONTROL DE FLOOD / ANTIBAN === */

// Tiempo mínimo entre eventos (recomendado: 300ms)
exports.TIMEOUT_IN_MILLISECONDS_BY_EVENT = 300;

/* === 🔌 API DE SPIDER (servicios extra, OCR, descargas) === */

exports.SPIDER_API_BASE_URL = "https://api.spiderx.com.br/api";
exports.SPIDER_API_TOKEN = "pon-tu-token-aqui";

/* === 🎯 MODO GRUPO EXCLUSIVO === */

// Si quieres que el bot solo responda en un grupo específico
exports.ONLY_GROUP_ID = ""; // Deja vacío si no aplica

/* === 🧪 MODO DEVELOPER === */

// Actívalo en true si quieres ver todo lo que pasa por consola
exports.DEVELOPER_MODE = false;

/* === 📦 BASE DEL BOT === */

exports.BASE_DIR = path.resolve(__dirname);

/* === 🌐 PROXY (solo si usas uno) === */

exports.PROXY_PROTOCOL = "http";
exports.PROXY_HOST = "ip_del_proxy";
exports.PROXY_PORT = "puerto";
exports.PROXY_USERNAME = "usuario";
exports.PROXY_PASSWORD = "contraseña";

/* === 🐍 BONUS TRACK === */

// Puedes meter más configuraciones especiales aquí más adelante.
// Este es tu cuartel general, bro.
