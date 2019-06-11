'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const app = express();
const api = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs',
}));

app.set('view engine', '.hbs');

app.use('/api', api);

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/chat-private', (req, res) => {
  res.render('chatPrivate');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/signin', (req, res) => {
  res.render('signin');
});

app.get('/', (req, res) => {
  res.render('home');
});

module.exports = app;
