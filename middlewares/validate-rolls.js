const isAdminRoll = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: 'Se pretende verificar el rol, sin validar primero el token',
    });
  }
  const { rol, nombre } = req.user;
  if (rol !== 'ADMIN_ROL') {
    return res.status(400).json({
      msg: `${nombre} no es Administrador - no puede realizar esta acción`,
    });
  }
  req.user;
  next();
};

const hasRoll = (...rolls) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'Se pretende verificar el rol, sin validar primero el token',
      });
    }

    if (!rolls.includes(req.user.rol)) {
      return res.status(401).json({
        msg: `${req.user.nombre} sin autorización, requiere uno de estos roles ${rolls}`,
      });
    }
    next();
  };
};

module.exports = {
  isAdminRoll,
  hasRoll,
};
