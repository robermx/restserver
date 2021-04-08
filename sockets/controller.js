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
  // agregar el usuario conectado
  chatMsgs.addUser(user);
  io.emit('active-users', chatMsgs.UsersArray);

  //Limpiar cuando un usuario se desconecta
  socket.on('disconnect', () => {
    chatMsgs.disconnectUser(user.id);
    io.emit('active-users', chatMsgs.UsersArray);
  });
};

module.exports = {
  socketController,
};
