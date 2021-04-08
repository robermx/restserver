const bcryptjs = require('bcryptjs');
const { genJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');
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
        msg: 'Usuario o password incorrectos - password',
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

const googleSingIn = async (req, res) => {
  const { id_token } = req.body;
  try {
    const { nombre, email, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });
    if (!user) {
      // hay que crearlo
      const data = {
        nombre,
        email,
        password: 'googlePass',
        img,
        google: true,
      };

      user = new User(data);
      await user.save();
    }
    if (!user.estado) {
      return res.status(401).json({
        msg: 'Usuario bloqueado por administrador',
      });
    }

    // generar el JWT
    const token = await genJWT(user.id);

    res.json({
      token,
    });
  } catch (err) {
    res.status(400).json({
      msg: 'El token de google no es reconocido',
    });
  }
};

// Renovar JWT
const renovateJWT = async (req, res) => {
  const { user } = req;
  // generar el JWT
  const token = await genJWT(user.id);
  res.json({
    user,
    token,
  });
};

module.exports = {
  login,
  googleSingIn,
  renovateJWT,
};
