const express = require('express');
const router = express.Router();

const {
    startGame,
    addPlayedPoint,
} = require('../controllers/play.controller');

router.post('/start', startGame);
router.post('/result', addPlayedPoint);

module.exports = router;