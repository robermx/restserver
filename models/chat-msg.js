class Message {
  constructor(uid, name, msg) {
    this.uid = uid;
    this.name = name;
    this.msg = msg;
  }
}

class ChatMsgs {
  constructor() {
    this.messages = [];
    this.users = {};
  }

  // Obtener últimos 10 mensajes
  get last10() {
    this.messages = this.messages.splice(0, 10);
    return this.messages;
  }

  // Retorna a los usuarios como un arreglo
  get UsersArray() {
    return Object.values(this.users);
  }

  // Enviar Mensaje
  sendMsg(uid, name, msg) {
    this.messages.unshift(new Message(uid, name, msg));
  }

  // Agregar Usuario al array
  addUser(user) {
    this.users[user.id] = user;
  }

  // Desconectar usuario
  disconnectUser(id) {
    delete this.users[id];
  }
}

module.exports = ChatMsgs;
