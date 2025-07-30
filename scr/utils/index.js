/**
 * 🌀 Funciones mágicas de Nethro Bot 🌀
 * ¡Aquí vive la lógica con swing, picardía y precisión!
 *
 * @author Roneth Bartra
 */

const path = require("node:path");
const fs = require("node:fs");
const readline = require("node:readline");
const { writeFile } = require("fs/promises");
const axios = require("axios");
const { downloadContentFromMessage, delay } = require("baileys");
const {
  PREFIX,
  COMMANDS_DIR,
  TEMP_DIR,
  ASSETS_DIR
} = require("../config");
const { errorLog } = require("./logger");

/** 🧠 Pregunta directa a consola */
exports.question = (message) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(message, resolve));
};

/** 📥 Descarga multimedia */
exports.download = async (webMessage, fileName, context, extension) => {
  const content = exports.getContent(webMessage, context);
  if (!content) return null;

  const stream = await downloadContentFromMessage(content, context);
  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  const filePath = path.resolve(TEMP_DIR, `${fileName}.${extension}`);
  await writeFile(filePath, buffer);
  return filePath;
};

/** 🧩 Extrae datos limpios del mensaje */
exports.extractDataFromMessage = (webMessage) => {
  const msg = webMessage.message || {};
  const text = msg.conversation || msg.extendedTextMessage?.text || msg.imageMessage?.caption || msg.videoMessage?.caption;

  const [command, ...args] = text?.split(" ") || [null];
  const commandName = command?.slice(PREFIX.length).toLowerCase();
  const isReply = !!msg.extendedTextMessage?.contextInfo?.quotedMessage;
  const replyJid = msg.extendedTextMessage?.contextInfo?.participant || null;
  const userJid = webMessage.key?.participant?.split(":")[0];
  const remoteJid = webMessage.key?.remoteJid;

  return {
    args: exports.splitByCharacters(args.join(" "), ["\\", "|", "/"]),
    commandName: exports.formatCommand(commandName),
    fullArgs: args.join(" "),
    fullMessage: text,
    isReply,
    prefix: command?.charAt(0),
    remoteJid,
    replyJid,
    userJid,
  };
};

/** 🎯 Verifica si es grupo */
exports.isGroup = (remoteJid) => remoteJid.endsWith("@g.us");

/** 💫 Elimina acentos y especiales */
exports.removeAccentsAndSpecialCharacters = (text) =>
  text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

/** 🔡 Solo letras y números */
exports.onlyLettersAndNumbers = (text) =>
  text.replace(/[^a-zA-Z0-9]/g, "");

/** 🧽 Limpia el comando */
exports.formatCommand = (text) =>
  exports.onlyLettersAndNumbers(
    exports.removeAccentsAndSpecialCharacters(text.trim())
  );

/** 🎚 Divide argumentos por caracteres */
exports.splitByCharacters = (str, chars) => {
  const regex = new RegExp(`[${chars.map((c) => (c === "\\" ? "\\\\" : c)).join("")}]`);
  return str.split(regex).map((s) => s.trim()).filter(Boolean);
};

/** 🔍 Busca y carga comandos dinámicamente */
exports.findCommandImport = (commandName) => {
  const command = exports.readCommandImports();

  for (const [type, commands] of Object.entries(command)) {
    const found = commands.find((cmd) =>
      cmd?.commands?.some(
        (c) => exports.formatCommand(c) === exports.formatCommand(commandName)
      )
    );
    if (found) return { type, command: found };
  }

  return { type: "", command: null };
};

/** 📚 Carga todos los comandos del directorio */
exports.readCommandImports = () => {
  const imports = {};
  const dirs = fs.readdirSync(COMMANDS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const dir of dirs) {
    const fullPath = path.join(COMMANDS_DIR, dir);
    const files = readDirectoryRecursive(fullPath)
      .map((filePath) => {
        try {
          return require(filePath);
        } catch (err) {
          errorLog(`❌ Error al importar ${filePath}: ${err.message}`);
          return null;
        }
      })
      .filter(Boolean);
    imports[dir] = files;
  }

  return imports;
};

function readDirectoryRecursive(dir) {
  const result = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of list) {
    const filePath = path.join(dir, item.name);
    if (item.isDirectory()) {
      result.push(...readDirectoryRecursive(filePath));
    } else if (!item.name.startsWith("_") && /\.(js|ts)$/.test(item.name)) {
      result.push(filePath);
    }
  }

  return result;
}

/** 📡 Verifica si es media (image, video, etc) */
exports.getContent = (msg, ctx) =>
  msg?.message?.[`${ctx}Message`] ||
  msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[`${ctx}Message`] ||
  msg?.message?.viewOnceMessage?.message?.[`${ctx}Message`] ||
  msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.[`${ctx}Message`];

/** 📦 Descarga buffer desde URL */
exports.getBuffer = (url, options = {}) =>
  axios
    .get(url, {
      responseType: "arraybuffer",
      headers: {
        DNT: 1,
        "Upgrade-Insecure-Request": 1,
        range: "bytes=0-",
        ...(options.headers || {}),
      },
      ...options,
    })
    .then((res) => res.data);

/** ⏱️ Delay aleatorio */
exports.randomDelay = async () => {
  const delays = [1000, 2000, 3000];
  return await delay(delays[Math.floor(Math.random() * delays.length)]);
};

/** 🧪 Genera nombre aleatorio */
exports.getRandomName = (ext = "") => {
  const base = `nethro_temp_${Math.floor(Math.random() * 999999)}`;
  return ext ? `${base}.${ext}` : base;
};

/** 📖 Leer más (anti-spam visual) */
exports.readMore = () => "\u200B".repeat(950);
