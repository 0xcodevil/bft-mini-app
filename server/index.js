require('dotenv').config({ path: '../.env' });
const path = require('path');
const express = require('express');
const cookieParser = require("cookie-parser");

const DB = require('./config/db');
const Cron = require('./cron');
const router = require('./routes');

const Server = express();

Server.use(express.json());
Server.use(cookieParser());
Server.use(express.urlencoded({ extended: true }));
Server.use('/api', router);

Server.use('/wallet-connect', express.static('../wallet/dist'));
Server.get('/wallet-connect/*', (_, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../wallet/dist') });
});
Server.use(express.static('../client/dist'));
Server.get('*', (_, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../client/dist') });
});

const port = process.env.PORT || 6002;
const start = async () => {
  try {
    await DB.connect(process.env.MONGO_URL);
    Server.listen(port, () => console.info(`Server is listening on port ${port}...`));
  } catch (error) {
    console.error(error);
  }
};

start();

Cron.start();
