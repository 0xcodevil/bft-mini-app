const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const taskRouter = require('./task.route');
const playRouter = require('./play.route');
const checkinRouter = require('./checkin.route');
const walletRouter = require('./wallet.route');
const guestRouter = require('./guest.route');

router.use('/auth', authRouter);
router.use('/user', authenticate, userRouter);
router.use('/task', authenticate, taskRouter);
router.use('/play', authenticate, playRouter);
router.use('/check-in', authenticate, checkinRouter);
router.use('/wallet', walletRouter);
router.use('/guest', guestRouter);

module.exports = router;