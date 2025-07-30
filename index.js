const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const path = require('path');
const fs = require('fs');

// Ruta de autenticación
const authFolder = './session';

// Iniciar conexión
async function connectBot() {
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Usando Baileys v${version.join('.')} ${isLatest ? '(última versión)' : ''}`);

  const socket = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    browser: ['Nethro-Bot-2026', 'Safari', '1.0.0']
  });

  socket.ev.on('creds.update', saveCreds);

  socket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      console.log('✅ ¡Bot conectado exitosamente!');
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ Conexión cerrada. Reintentando:', shouldReconnect);
      if (shouldReconnect) {
        connectBot();
      } else {
        console.log('⛔ Sesión cerrada. Escanea de nuevo o elimina la carpeta "session".');
      }
    }
  });

  socket.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const command = body.trim().toLowerCase();

    // Comando de prueba
    if (command === '.menu') {
      await socket.sendMessage(from, {
        text: `👋 ¡Qué onda bro! Aquí están los comandos disponibles:\n\n• .menu\n• .kick\n• .setwelcome\n• .todos\n• .nethrolive\n• .infodecreador`
      });
    }
  });
}

// Inicia el bot
connectBot();

