const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const {
  checkWalletConnection,
  getWalletBalance,
  generateNonce,
  verifyWallet,
} = require('../controllers/wallet.controller');

router.get('/check', authenticate, checkWalletConnection);
router.get('/balance', authenticate, getWalletBalance);
router.post('/request', generateNonce);
router.post('/sign', verifyWallet);

module.exports = router;