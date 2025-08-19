const { StatusCodes } = require('http-status-codes');
const { createPublicClient, http, parseAbi, formatUnits, verifyMessage } = require('viem');
const { bsc } = require('viem/chains');

const User = require('../models/user.model');
const Nonce = require('../models/nonce.model');

const bft = '0x4b87F578d6FaBf381f43bd2197fBB2A877da6ef8';
const bbft = '0xfB69e2d3d673A8DB9Fa74ffc036A8Cf641255769';

const rpc = bsc;
rpc.rpcUrls.default.http[0] = rpc.rpcUrls.default.http[0] + '/9e9fd220fa4fee667e12b6844948733a0fbdf8a98b6bd7593fff9acb9570856b';

const client = createPublicClient({
  chain: rpc,
  transport: http(),
});

const erc20Abi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
]);

const checkWalletConnection = async (req, res) => {
  return res.json(req.user.wallet);
}

const getWalletBalance = async (req, res) => {
  if (!req.user.wallet.address) return res.json({ bft: 0, bbft: 0 });

  const results = await client.multicall({
    contracts: [
      {
        address: bft,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [req.user.wallet.address]
      },
      {
        address: bft,
        abi: erc20Abi,
        functionName: 'decimals',
        args: []
      },
      {
        address: bbft,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [req.user.wallet.address]
      },
      {
        address: bbft,
        abi: erc20Abi,
        functionName: 'decimals',
        args: []
      },
    ]
  });

  const bftBalance = results[0].status === 'success' && results[1].status === 'success' ? formatUnits(results[0].result, results[1].result) : 0;
  const bbftBalance = results[2].status === 'success' && results[3].status === 'success' ? formatUnits(results[2].result, results[3].result) : 0;

  return res.json({
    bft: bftBalance,
    bbft: bbftBalance,
  });
}

const generateNonce = async (req, res) => {
  const { address } = req.body;
  const nonce = Math.floor(Math.random() * 1000000).toString();

  let nonceModel = await Nonce.findOne({ address });
  if (nonceModel) {
    nonceModel.nonce = nonce;
  } else {
    nonceModel = new Nonce({ address, nonce });
  }
  await nonceModel.save();

  res.json({ message: `Sign this nonce: ${nonce}` });
}

const verifyWallet = async (req, res) => {
  const { telegramId, address, signature } = req.body;

  const nonce = await Nonce.findOne({ address });
  if (!nonce) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No nonce for address' });

  const isValid = await verifyMessage({
    address,
    message: `Sign this nonce: ${nonce.nonce}`,
    signature
  });
  if (!isValid) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid signature' });

  const user = await User.findOne({ 'wallet.address': address });
  if (user) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'This address is already attached to another user.' });

  const me = await User.findOne({ 'telegram.id': telegramId });
  if (!me) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User not found.' });

  me.wallet.address = address;
  await me.save();

  res.json({ success: true });
}

module.exports = {
  checkWalletConnection,
  getWalletBalance,
  generateNonce,
  verifyWallet,
}