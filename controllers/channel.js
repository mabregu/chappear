'use strict'

const Channel = require('../models/channel');

function getChannel(req, res) {
  let channelId = req.params.channelId;

  Channel.findById(channelId, (err, channel) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
    if (!channel) return res.status(404).send({ message: `El canal no existe` });

    res.status(200).send({ channel });
  });
}

function getChannels(req, res) {
  Channel.find({}, (err, channels) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
    if (!channels) return res.status(404).send({ message: 'No existen canales' });

    res.send(200, { channels });
  });
}

function saveChannel(req, res) {
  console.log('POST /api/channel');
  console.log(req.body);

  let channel = new Channel();
  channel.name = req.body.name;
  channel.user = req.body.user;
  channel.description = req.body.description;

  channel.save((err, channelStored) => {
    if (err) res.status(500).send({ message: `Error al salvar en la base de datos: ${err} ` });

    res.status(200).send({ channel: channelStored });
  });
}

function deleteChannelWithMoreThanTwoDays(req, res) {
  let now = new Date();

  Channel.find({ signupDate: { $lt: now } }, (err, channel) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
    if (!channel) return res.status(404).send({ message: `El canal no existe` });
    
    channel.map( ( val ) => {
      if ( ((now.getTime() - val.signupDate.getTime()) / (60 * 60 * 24 * 1000))>2 ) {
        deleteChannelById(val._id)
      }
    });

    res.status(200).send({ channel });
  });
}

function deleteChannelById(channelId) {
  Channel.findById(channelId, (err, channel) => {
    if (err) console.log({ message: `Error al borrar el canal: ${err}` });

    channel.remove(err => {
      if (err) console.log({ message: `Error al borrar el canal: ${err}` });
      console.log({ message: 'El canal ha sido eliminado' });
    });
  });
}

function updateChannel(req, res) {
  let channelId = req.params.channelId;
  let update = req.body;

  Channel.findByIdAndUpdate(channelId, update, (err, channelUpdated) => {
    if (err) res.status(500).send({ message: `Error al actualizar el canal: ${err}` });

    res.status(200).send({ channel: channelUpdated });
  });
}

function deleteChannel(req, res) {
  let channelId = req.params.channelId;

  Channel.findById(channelId, (err, channel) => {
    if (err) res.status(500).send({ message: `Error al borrar el canal: ${err}` });

    channel.remove(err => {
      if (err) res.status(500).send({ message: `Error al borrar el canal: ${err}` });
      res.status(200).send({ message: 'El canal ha sido eliminado' });
    });
  });
}

module.exports = {
  getChannel,
  getChannels,
  saveChannel,
  updateChannel,
  deleteChannel,
  deleteChannelWithMoreThanTwoDays,
};
