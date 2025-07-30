/**
 * 🚀 NETHRO-BOT-2026: Iniciando motores...
 * ────────────────────────────────────────
 * Este script es el corazón de la conexión con WhatsApp.
 * Si no sabes lo que haces, mejor no toques nada por aquí 😅
 * 
 * @author Dev Gui
 */

const path = require("node:path");
const fs = require("node:fs");
const pino = require("pino");
const NodeCache = require("node-cache");

const { question, onlyNumbers } = require("./utils");
const { warningLog, infoLog, errorLog, sayLog, successLog } = require("./utils/logger");
const { badMacHandler } = require("./utils/badMacHandler");
const { load } = require("./loader");
const { TEMP_DIR } = require("./config");

const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  isJidStatusBroadcast,
  isJidNewsletter,
  makeCacheableSignalKeyStore,
} = require("baileys");

// 📁 Asegúrate de tener la carpeta temporal
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 🧾 Configura logs con estilo
const logger = pino(
  { timestamp: () => `,"time":"${new Date().toJSON()}"` },
  pino.destination(path.join(TEMP_DIR, "wa-logs.txt"))
);
logger.level = "error";

// 📦 Para manejar reintentos
const msgRetryCounterCache = new NodeCache();

// 🔌 Función principal: conecta al universo WhatsApp
async function connect() {
  const baileysFolder = path.resolve(__dirname, "..", "assets", "auth", "baileys");

  const { state, saveCreds } = await useMultiFileAuthState(baileysFolder);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    version,
    logger,
    defaultQueryTimeoutMs: undefined,
    retryRequestDelayMs: 5000,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    shouldIgnoreJid: jid =>
      isJidBroadcast(jid) || isJidStatusBroadcast(jid) || isJidNewsletter(jid),
    keepAliveIntervalMs: 30_000,
    maxMsgRetryCount: 5,
    markOnlineOnConnect: true,
    syncFullHistory: false,
    msgRetryCounterCache,
    shouldSyncHistoryMessage: () => false,
  });

  // 📲 Si es la primera vez, pedimos emparejamiento
  if (!socket.authState.creds.registered) {
    warningLog("🚨 ¡Aún no has configurado el número del bot!");

    infoLog("📞 Ingresa el número del bot (ej: 5491122334455):");
    const phoneNumber = await question("➡️ Número de teléfono: ");

    if (!phoneNumber) {
      errorLog("⚠️ Número inválido. Reinicia con `npm start`.");
      process.exit(1);
    }

    const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));
    sayLog(`🔗 Código para emparejar: ${code}`);
  }

  // 📡 Escuchando cambios en la conexión
  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const error = lastDisconnect?.error;
      const statusCode = error?.output?.statusCode;

      if (
        error?.message?.includes("Bad MAC") ||
        error?.toString()?.includes("Bad MAC")
      ) {
        errorLog("💥 Se detectó un Bad MAC al desconectarse");

        if (badMacHandler.handleError(error, "connection.update")) {
          if (badMacHandler.hasReachedLimit()) {
            warningLog("🔥 Límite alcanzado. Limpiando sesión...");
            badMacHandler.clearProblematicSessionFiles();
            badMacHandler.resetErrorCount();

            const newSocket = await connect();
            load(newSocket);
            return;
          }
        }
      }

      switch (statusCode) {
        case DisconnectReason.loggedOut:
          errorLog("❌ Bot desconectado.");
          break;
        case DisconnectReason.badSession:
          warningLog("📛 Sesión inválida. Limpiando...");
          if (badMacHandler.handleError(new Error("Bad session"), "badSession")) {
            if (badMacHandler.hasReachedLimit()) {
              badMacHandler.clearProblematicSessionFiles();
              badMacHandler.resetErrorCount();
            }
          }
          break;
        case DisconnectReason.connectionClosed:
          warningLog("🔌 Conexión cerrada.");
          break;
        case DisconnectReason.connectionLost:
          warningLog("📶 Conexión perdida.");
          break;
        case DisconnectReason.connectionReplaced:
          warningLog("🔄 Conexión reemplazada.");
          break;
        case DisconnectReason.multideviceMismatch:
          warningLog("📵 Dispositivo incompatible.");
          break;
        case DisconnectReason.forbidden:
          warningLog("⛔ Conexión prohibida.");
          break;
        case DisconnectReason.restartRequired:
          infoLog("♻️ Reinicio necesario. Ejecuta `npm start`.");
          break;
        case DisconnectReason.unavailableService:
          warningLog("🚫 Servicio no disponible.");
          break;
      }

      // 🚀 Intentar reconectar
      const newSocket = await connect();
      load(newSocket);
    } else if (connection === "open") {
      successLog("✅ ¡Conexión exitosa con WhatsApp!");
      infoLog("📦 Versión WhatsApp Web: " + version.join("."));
      infoLog("🆕 ¿Última versión?: " + (isLatest ? "Sí" : "No"));

      badMacHandler.resetErrorCount();
    } else {
      infoLog("🔄 Actualizando conexión...");
    }
  });

  // 💾 Guardar credenciales al cambiar
  socket.ev.on("creds.update", saveCreds);

  return socket;
}

exports.connect = connect;
