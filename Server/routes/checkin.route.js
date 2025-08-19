const express = require('express');
const router = express.Router();

const { 
  check,
  checkDailyReward,
  claimDailyReward
} = require('../controllers/checkin.controller');

router.get('/', check);
router.get('/check', checkDailyReward);
router.post('/claim', claimDailyReward);

module.exports = router;
