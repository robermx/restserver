const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req, res, next) => {
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición',
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECORPRIVKEY);

    // Leer el usuario autenticado
    user = await User.findById(uid);

    // Autenticar user - que exista en la base de datos
    if (!user) {
      return res.status(401).json({
        msg: 'Token no valido - user no existe DB',
      });
    }

    // Verificar si el UID tiene estado: true
    if (!user.estado) {
      return res.status(401).json({
        msg: 'Token no válido - user estado: false',
      });
    }

    req.user = user;

    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({
      msg: 'Token no válido',
    });
  }
};

module.exports = {
  validateJWT,
};
