/**
 * Logs y Registro de Actividad del Grupo con todo el flow
 *
 * @autor Nethro-Team🔥
 */
const { version } = require("../../package.json");

const messageActivity = {}; // 🔍 Aquí vamos registrando el chismecito de quién habla y quién solo lee

// 📢 LOGS con color y actitud
exports.sayLog = (message) => {
  console.log("\x1b[36m[NETHRO BOT | CHISMECITO]\x1b[0m", message);
};

exports.inputLog = (message) => {
  console.log("\x1b[30m[NETHRO BOT | INPUT]\x1b[0m", message);
};

exports.infoLog = (message) => {
  console.log("\x1b[34m[NETHRO BOT | INFO]\x1b[0m", message);
};

exports.successLog = (message) => {
  console.log("\x1b[32m[NETHRO BOT | ÉXITO]\x1b[0m", message);
};

exports.errorLog = (message) => {
  console.log("\x1b[31m[NETHRO BOT | ERROR]\x1b[0m", message);
};

exports.warningLog = (message) => {
  console.log("\x1b[33m[NETHRO BOT | OJO]\x1b[0m", message);
};

// 🧱 Banner de bienvenida al mundo Nethro
exports.bannerLog = () => {
  console.log(`\x1b[36m░█▄█░█▀█░█░█░█▀▀░█░█░█▀█░░░█▀▄░█▀█░▀█▀\x1b[0m`);
  console.log(`░█░█░█▀█░█▀█░█░█░█▀█░█░█░░░█▀▄░█░█░░█░`);
  console.log(`\x1b[36m░▀░▀░▀░▀░▀░▀░▀▀▀░▀░▀░▀▀▀░░░▀▀░░▀▀▀░░▀░\x1b[0m`);
  console.log(`\x1b[36m🔥 Nethro-Bot-2026 enciende motores | Versión:\x1b[0m ${version}\n`);
};

// 📈 Registro de actividad por mensaje

/**
 * Guarda un mensaje de un usuario en el grupo
 * @param {string} groupId - ID del grupo
 * @param {string} userId - ID del usuario
 */
exports.registerGroupMessage = (groupId, userId) => {
  if (!messageActivity[groupId]) {
    messageActivity[groupId] = {};
  }
  if (!messageActivity[groupId][userId]) {
    messageActivity[groupId][userId] = 0;
  }
  messageActivity[groupId][userId]++;
};

/**
 * Devuelve el conteo de mensajes por usuario en un grupo
 * @param {string} groupId - ID del grupo
 * @returns {Object} - Objeto con userId: cantidad de mensajes
 */
exports.getGroupMessageActivity = (groupId) => {
  return messageActivity[groupId] || {};
};

