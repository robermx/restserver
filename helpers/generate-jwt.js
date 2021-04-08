const jwt = require('jsonwebtoken');
const { User } = require('../models');

const genJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECORPRIVKEY,
      {
        expiresIn: '4h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

// Comprobar JWT
const compJWT = async (token) => {
  try {
    if (token.length < 10) {
      return null;
    }
    // verificar UID de usuario dentro del JWT
    const { uid } = jwt.verify(token, process.env.SECORPRIVKEY);
    const user = await User.findById(uid);
    if (user) {
      if (user.estado) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

module.exports = {
  genJWT,
  compJWT,
};
