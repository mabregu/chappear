'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

var servidor = require('http').Server(app);
var io = require('socket.io')(servidor);
var messages = [
  {
    room: 'General',
    author: 'Admin',
    text: 'Bienvenido!',
  },
];

io.on('connection', (socket) => {
    console.log('Se ha recibido un socket: ' + socket.id);
    var idSockets = [Object.keys(io.sockets.connected)];
    socket.emit('messages',  messages);

    socket.on('new-message', (data) => {
      messages.push(data);
      io.sockets.emit('messages', messages);
    });

    socket.on('subscribe', (data) => {
      var socketData = {
        id: socket.id,
        author: data.author,
        idSockets: idSockets,
      };

      io.sockets.emit('userSocket', socketData);
      console.log('joining room', data.room + ' - ' + data.author);
    });

    socket.on('chatPrivate', (data) => {
      messages.push(data);
      io.to(`${data.id_destino}`).emit('hey', data);
    });

    socket.on('unsubscribe', (room) => {
      console.log('leaving room', room);
      socket.leave(room);
    });

  });

mongoose.connect(config.db, (err, res) => {

  if (err)
    return console.log(`Error al conectar a la base de datos: ${err}`);
  console.log('Conexión a la base de datos establecida...');

  servidor.listen(config.port, () => {
    console.log(`API REST corriendo en http://localhost:${config.port}`);
  });

});
