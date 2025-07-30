const { default: makeWASocket, DisconnectReason } = require("@whiskeysockets/baileys");
const { useRemoteFileAuthState } = require("@adiwajshing/baileys-auth");
const pino = require("pino");
const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (text) => new Promise((resolve) => rl.question(text, resolve));

async function start() {
  console.clear();
  console.log("🟢 Iniciando Nethro-Bot-2026...");

  if (!fs.existsSync("./session")) fs.mkdirSync("./session");

  const { state, saveCreds } = await useRemoteFileAuthState({
    credsPath: "./session",
    browser: ["NethroBot", "Termux", "1.0"]
  });

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: ["NethroBot-Termux", "Linux", "1.0.0"],
    logger: pino({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ Bot conectado bro 😎 ¡Todo chido!");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("❌ Desconectado. Reintentando:", shouldReconnect);
      if (shouldReconnect) start();
    }
  });

  // Ejemplo de respuesta
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const text = m.message.conversation || "";
    const jid = m.key.remoteJid;

    if (text.toLowerCase().startsWith(".hola")) {
      await sock.sendMessage(jid, { text: "😎 ¡Qué onda bro! Nethro-Bot activo 💥" });
    }
  });

  // Si aún no estás registrado, te pide código SMS
  if (!state.creds.registered) {
    const phoneNumber = await ask("📱 Ingresa tu número (ej: 51987654321): ");
    const { registration } = await sock.requestRegistrationCode({
      phoneNumber,
      method: "sms"
    });

    console.log("📩 Código enviado por SMS");

    const code = await ask("🔢 Ingresa el código recibido: ");
    await sock.register(code);
    console.log("✅ Registro exitoso bro 🐱‍👤");
    rl.close();
  }
}

start();
