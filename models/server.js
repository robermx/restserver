const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConn } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);
    //paths
    this.paths = {
      auth: '/api/auth',
      category: '/api/category',
      products: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads',
      users: '/api/users',
    };

    // Conectar a base de datos
    this.connDB();
    // Middleware
    this.middleware();
    // Rutas de la App
    this.routes();
    // Sockets events
    this.sockets();
  }

  // Conectar a base de datos
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
    // FileUpload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    );
  }

  // Rutas de restserver
  routes() {
    this.app.use(this.paths.auth, require('../routes/auth.routes'));
    this.app.use(this.paths.category, require('../routes/category.routes'));
    this.app.use(this.paths.products, require('../routes/products.routes'));
    this.app.use(this.paths.search, require('../routes/search.routes'));
    this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
    this.app.use(this.paths.users, require('../routes/users.routes'));
  }

  // Función sockets
  sockets() {
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  // A este método lo llamamos desde app
  listen() {
    this.server.listen(this.port, () => {
      console.log(`RestServer app listening at http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
