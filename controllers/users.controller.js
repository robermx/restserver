//TODO: ver qeu tan necesaria esta linea.
const { request, response } = require('express');

const usersGet = (req, res) => {
  const { key } = req.query;
  res.json({
    msg: 'get API - controller',
    key,
  });
};
const usersPost = (req, res) => {
  const { nombre, id } = req.body;
  res.json({
    msg: 'post API - controller',
    nombre,
    id,
  });
};
const usersPut = (req, res) => {
  res.json({
    msg: 'put API - controller',
  });
};
const usersPatch = (req, res) => {
  res.json({
    msg: 'patch API - controller',
  });
};
const usersDelete = (req, res) => {
  res.json({
    msg: 'delete API - controller',
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
