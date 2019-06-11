'use strict'

const User = require('../models/user');
const service = require('../services');

function signUp(req, res) {

  if (!isEmail(req.body.email))
    return res.status(500).send({ message: `¡Correo no valido!` });

  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName,
    password: req.body.password,
    category: req.body.category,
  });

  user.save((err) => {
    if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` });

    return res.status(201).send({ token: service.createToken(user), estado: true });
  });
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function signIn(req, res) {
  User.find({ email: req.body.email, password: req.body.password }, (err, user) => {
    if (typeof user === 'undefined' || user.length <= 0)
      return res.status(404).send({
        message: '¡usuario o contraseña incorrecto!',
        estado: false,
      });
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: 'No existe el usuario' });

    req.user = user;
    res.status(200).send({
      message: 'Te has logueado correctamente',
      estado: true,
      token: service.createToken(user),
      username: user,
    });
  });
}

function getUsers(req, res) {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
    if (!users) return res.status(404).send({ message: 'No existen usuarios' });

    res.send(200, { users });
  });
}

// function getProduct(req, res) {
//   let productId = req.params.productId;
//
//   Product.findById(productId, (err, product) => {
//     if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
//     if (!product) return res.status(404).send({ message: `El producto no existe` });
//
//     res.status(200).send({ product });
//   });
// }

module.exports = {
  signUp,
  signIn,
  getUsers,
};
