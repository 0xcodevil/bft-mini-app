const express = require('express');
const router = express.Router();

const {
  log
} = require('../controllers/error.controller');

router.post('/log', log);

module.exports = router;
