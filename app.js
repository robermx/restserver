require('dotenv').config();
const Server = require('./models/server');
// Crear constante de la nueva clase server
const server = new Server();

// Llamar el método listen
server.listen();
