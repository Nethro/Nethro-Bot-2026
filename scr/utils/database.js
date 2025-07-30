const messageActivity = {};

/**
 * Guarda un mensaje de un usuario en el grupo
 */
function registerGroupMessage(groupId, userId) {
  if (!messageActivity[groupId]) {
    messageActivity[groupId] = {};
  }
  if (!messageActivity[groupId][userId]) {
    messageActivity[groupId][userId] = 0;
  }
  messageActivity[groupId][userId]++;
}

/**
 * Devuelve el conteo de mensajes por usuario en un grupo
 */
function getGroupMessageActivity(groupId) {
  return messageActivity[groupId] || {};
}

module.exports = {
  registerGroupMessage,
  getGroupMessageActivity
};

