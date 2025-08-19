const express = require('express');
const router = express.Router();

const {
  info
} = require('../controllers/user.controller');

router.post('/info', info);

module.exports = router;
