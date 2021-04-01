const vlidateFlileUpload = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      msg: 'No existe archivo para subirlo',
    });
  }
  next();
};

module.exports = {
  vlidateFlileUpload,
};
