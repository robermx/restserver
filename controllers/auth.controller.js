const bcryptjs = require('bcryptjs');
const { genJWT } = require('../helpers/generate-jwt');
// Require user model
const User = require('../models/user');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // verificar si el email existe
    if (!user) {
      return res.status(400).json({
        msg: 'Usuario o password incorrectos - email',
      });
    }

    // Si el usuario esta activo en la base de datos
    if (!user.estado) {
      return res.status(400).json({
        msg: 'Usuario o password incorrectos - estado: false',
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario o password incorrectos - password mal escrito',
      });
    }
    // generar el jwt
    const token = await genJWT(user.id);
    res.json({
      user,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: 'Error, hable con el administrador',
    });
  }
};

module.exports = {
  login,
};
