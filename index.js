const { default: NethroBot, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const sock = NethroBot({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("🔥 Conectado a WhatsApp bro, todo chido 😎");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const mensaje = m.message.conversation || "";
    const chat = m.key.remoteJid;

    if (mensaje.toLowerCase().includes("hola")) {
      await sock.sendMessage(chat, { text: "¡Qué onda bro! Aquí Nethro-Bot-2026 a tu servicio 💥" });
    }
  });
}

start();
