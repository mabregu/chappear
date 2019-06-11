'use strict'

const express = require('express');
const productCtrl = require('../controllers/product');
const channelCtrl = require('../controllers/channel');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const api = express.Router();

api.get('/product', auth, productCtrl.getProducts);
api.get('/product/:productId', productCtrl.getProduct);
api.post('/product', auth, productCtrl.saveProduct);
api.put('/product/:productId', auth, productCtrl.updateProduct);
api.delete('/product/:productId', auth, productCtrl.deleteProduct);

api.get('/channel', channelCtrl.getChannels);
api.delete('/channelDate', channelCtrl.deleteChannelWithMoreThanTwoDays);
api.get('/channel/:channelId', channelCtrl.getChannel);
api.post('/channel', channelCtrl.saveChannel);
api.put('/channel/:channelId', auth, channelCtrl.updateChannel);
api.delete('/channel/:channelId', auth, channelCtrl.deleteChannel);

api.get('/users', userCtrl.getUsers);
api.post('/signup', userCtrl.signUp);
api.post('/signin', userCtrl.signIn);
api.get('/private', auth, (req, res) => {
  res.status(200).send({ message: 'Tienes acceso' });
});

module.exports = api;
