const express = require('express');
const cors = require('cors');

const { dbConn } = require('../database/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    //paths
    this.usersPath = '/api/users';
    // Conectar a base de datos
    this.connDB();
    // Middleware
    this.middleware();
    // Rutas de la App
    this.routes();
  }
  async connDB() {
    await dbConn();
  }
  middleware() {
    // Cors
    this.app.use(cors());
    // Lectura y parse del body
    this.app.use(express.json());
    // Directorio público
    this.app.use(express.static('public'));
  }
  routes() {
    this.app.use(this.usersPath, require('../routes/users.routes'));
  }
  // A este método lo llamamos desde app.js
  listen() {
    this.app.listen(this.port, () => {
      console.log(`RestServer app listening at http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
