const express = require('express');
const router = express.Router();

const {
    me,
    getBalance,
    getLeaderboard,
    getAllUserCount,
    getFriends,
    getInviter,
} = require('../controllers/user.controller');

router.get('/me', me);
router.get('/balance', getBalance);
router.get('/ranking/:type', getLeaderboard);
router.get('/count', getAllUserCount);
router.get('/friends', getFriends);
router.get('/inviter', getInviter);

module.exports = router;
