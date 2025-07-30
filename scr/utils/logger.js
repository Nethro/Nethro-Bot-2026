/**
 * Logs con Flow y Picardía para Nethro-Bot-2026
 *
 * @ronethbartrac
 */

const { version } = require("../../package.json");

const tag = (label, colorCode) => `\x1b[${colorCode}m[NETHRO BOT | ${label}]\x1b[0m`;

exports.sayLog = (message) => {
  console.log(`${tag("TALK 💬", "36")}`, message);
};

exports.inputLog = (message) => {
  console.log(`${tag("INPUT 🎯", "30")}`, message);
};

exports.infoLog = (message) => {
  console.log(`${tag("INFO ℹ️", "34")}`, message);
};

exports.successLog = (message) => {
  console.log(`${tag("SUCCESS ✅", "32")}`, message);
};

exports.errorLog = (message) => {
  console.log(`${tag("ERROR ❌", "31")}`, message);
};

exports.warningLog = (message) => {
  console.log(`${tag("WARNING ⚠️", "33")}`, message);
};

exports.bannerLog = () => {
  console.clear();
  console.log(`\x1b[35m╔═══════════════════════════════════════════╗\x1b[0m`);
  console.log(`\x1b[35m║\x1b[36m    🧠 Bienvenido al flow de Nethro-Bot!     \x1b[35m║\x1b[0m`);
  console.log(`\x1b[35m║\x1b[36m   🤖 Versión:\x1b[0m ${version.padEnd(34)}\x1b[35m║\x1b[0m`);
  console.log(`\x1b[35m║\x1b[36m   🔥 Activo y con picardía pa' los grupos   \x1b[35m║\x1b[0m`);
  console.log(`\x1b[35m╚═══════════════════════════════════════════╝\x1b[0m\n`);
};

};
