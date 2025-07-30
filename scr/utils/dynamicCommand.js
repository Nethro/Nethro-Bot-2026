/**
 * 🌊 Enrutador con flow de comandos 🔥
 * by Dev Gui ft. Nethro-Bot-2026 😎
 */

const {
  DangerError,
  WarningError,
  InvalidParameterError,
} = require("../errors");
const { findCommandImport } = require(".");
const {
  verifyPrefix,
  hasTypeAndCommand,
  isLink,
  isAdmin,
  checkPermission,
  isBotOwner,
} = require("../middlewares");
const {
  isActiveGroup,
  getAutoResponderResponse,
  isActiveAutoResponderGroup,
  isActiveAntiLinkGroup,
  isActiveOnlyAdmins,
} = require("./database");
const { errorLog } = require("../utils/logger");
const { ONLY_GROUP_ID } = require("../config");
const { badMacHandler } = require("./badMacHandler");

exports.dynamicCommand = async (paramsHandler, startProcess) => {
  const {
    commandName,
    prefix,
    sendWarningReply,
    sendErrorReply,
    sendReply,
    remoteJid,
    socket,
    userJid,
    fullMessage,
    webMessage,
    isLid,
  } = paramsHandler;

  const activeGroup = isActiveGroup(remoteJid);

  // 👮‍♂️ Anti-Link con castigo instantáneo
  if (activeGroup && isActiveAntiLinkGroup(remoteJid) && isLink(fullMessage)) {
    if (!userJid) return;

    const esAdmin = await isAdmin({ remoteJid, userJid, socket });

    if (!esAdmin) {
      await socket.groupParticipantsUpdate(remoteJid, [userJid], "remove");
      await sendReply("🔗 ¡Anti-link activado! ¡Pa' fuera por compartir enlaces!");
      await socket.sendMessage(remoteJid, {
        delete: {
          remoteJid,
          fromMe: false,
          id: webMessage.key.id,
          participant: webMessage.key.participant,
        },
      });
      return;
    }
  }

  const { type, command } = findCommandImport(commandName);

  // 🚫 Solo para el grupo exclusivo si está configurado
  if (ONLY_GROUP_ID && ONLY_GROUP_ID !== remoteJid) return;

  // 🔁 Validación y respuesta automática si aplica
  if (activeGroup) {
    if (!verifyPrefix(prefix) || !hasTypeAndCommand({ type, command })) {
      if (isActiveAutoResponderGroup(remoteJid)) {
        const response = getAutoResponderResponse(fullMessage);
        if (response) await sendReply(response);
      }
      return;
    }

    if (!(await checkPermission({ type, ...paramsHandler }))) {
      await sendErrorReply("🚫 No tienes permiso para ejecutar este comando.");
      return;
    }

    if (
      isActiveOnlyAdmins(remoteJid) &&
      !(await isAdmin({ remoteJid, userJid, socket }))
    ) {
      await sendWarningReply("⚠️ Solo los admins pueden usar comandos en este grupo.");
      return;
    }
  }

  // ⛔ Grupo inactivo para el bot
  if (!isBotOwner({ userJid, isLid }) && !activeGroup) {
    if (verifyPrefix(prefix) && hasTypeAndCommand({ type, command })) {
      if (command.name !== "on") {
        await sendWarningReply("⚠️ Este grupo está apagado pa'l bot. Pídele al dueño que lo active.");
        return;
      }

      if (!(await checkPermission({ type, ...paramsHandler }))) {
        await sendErrorReply("🚫 No puedes ejecutar este comando aquí.");
        return;
      }
    } else {
      return;
    }
  }

  if (!verifyPrefix(prefix)) return;

  try {
    await command.handle({
      ...paramsHandler,
      type,
      startProcess,
    });
  } catch (error) {
    if (badMacHandler.handleError(error, `command:${command?.name}`)) {
      await sendWarningReply("📶 Error de conexión temporal. Inténtalo en unos segundos.");
      return;
    }

    if (badMacHandler.isSessionError(error)) {
      errorLog(`💥 Error de sesión (${command?.name}): ${error.message}`);
      await sendWarningReply("🧠 Problemas de comunicación con WhatsApp. Intenta otra vez.");
      return;
    }

    if (error instanceof InvalidParameterError) {
      await sendWarningReply(`⚠️ Parámetros inválidos: ${error.message}`);
    } else if (error instanceof WarningError) {
      await sendWarningReply(error.message);
    } else if (error instanceof DangerError) {
      await sendErrorReply(error.message);
    } else if (error.isAxiosError) {
      const messageText = error.response?.data?.message || error.message;
      const url = error.config?.url || "URL desconocida";
      const isSpiderAPIError = url.includes("api.spiderx.com.br");

      await sendErrorReply(
        `🌐 Error al conectar con ${
          isSpiderAPIError ? "Spider X API" : url
        } en el comando *${command.name}*.

📄 *Mensaje*: ${messageText}`
      );
    } else {
      errorLog("🔥 Explotó el comando", error);
      await sendErrorReply(
        `🔥 ¡Ocurrió un fallo inesperado ejecutando *${command.name}*!

🧠 *Mensaje*: ${error.message}`
      );
    }
  }
};
