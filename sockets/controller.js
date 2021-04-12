const { compJWT } = require('../helpers');
const { ChatMsgs } = require('../models');

const chatMsgs = new ChatMsgs();

const socketController = async (socket, io) => {
  // console.log('client connected', socket.id);
  const token = socket.handshake.headers['x-token'];
  const user = await compJWT(token);
  if (!user) {
    return socket.disconnect();
  }
  // agregar Al mensaje y al usuario conectado
  chatMsgs.addUser(user);
  io.emit('active-users', chatMsgs.UsersArray);
  socket.emit('recive-msg', chatMsgs.last10);

  // Conectar a una sala especial privada
  socket.join(user.id);

  //Limpiar cuando un usuario se desconecta
  socket.on('disconnect', () => {
    chatMsgs.disconnectUser(user.id);
    io.emit('active-users', chatMsgs.UsersArray);
  });

  // Enviar el mensaje
  socket.on('sendMsg', ({ uid, msg }) => {
    if (uid) {
      // Mensaje privado
      socket.to(uid).emit('private-msg', { name: user.nombre, msg });
    } else {
      // Mensaje global
      chatMsgs.sendMsg(user.id, user.nombre, msg);
      io.emit('recive-msg', chatMsgs.last10);
    }
  });
};

module.exports = {
  socketController,
};
