const { createPublicClient, http, parseAbi, parseAbiItem } = require('viem');
const { ink/*, bscTestnet*/ } = require('viem/chains');
const { formatEther } = require('viem');
const abi = require('../config/abi.json');
const { CONTRACT_ADDRESS, VERIFY_ADDRESS } = require('../config');
const { sendMessage } = require('./telegram');

const User = require('../models/user.model');
const Config = require('../models/config.model');

const client = createPublicClient({
  chain: ink,
  transport: http()
});

module.exports.fetchTokenTransfer = async () => {
  try {
    const config = await Config.findOne({ _id: "config" });
    const price = config?.price ?? 0;
    const lastBlockNumber = config?.lastBlockNumber ?? 1;


    const logs = await client.getLogs({
      address: CONTRACT_ADDRESS,
      event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)"),
      args: { to: VERIFY_ADDRESS },
      fromBlock: BigInt(lastBlockNumber),
    });

    for (const log of logs) {
      console.log('Token transfer detected:');
      console.log('\tFrom:', log.args.from);
      console.log('\tTo:', log.args.to);
      console.log('\tAmount:', log.args.value);
      const to = log.args.to;
      if (to.toLowerCase() !== VERIFY_ADDRESS.toLowerCase()) continue;

      const transferAmount = parseFloat(formatEther(log.args.value));

      const from = log.args.from.toLowerCase();
      const user = await User.findOne({ 'ink.wallet': from, 'ink.verified': true });

      if (user) {
        const coin = Math.floor(10 * price * transferAmount);
        if (coin > 0) {
          user.coin += coin;
          user.save();
          console.log(`${user.telegram.firstName} purchased ${coin} Coins. hash: ${log.transactionHash}`);
          sendMessage(user.telegram.id, `You purchased ${coin} Coins. hash: ${log.transactionHash}`);
        }
      } else {
        const userToVerify = await User.findOne({ 'ink.wallet': from, 'ink.verified': false });
        if (!userToVerify) continue;

        const minimumTokenAmount = 1 / price;
        if (transferAmount >= minimumTokenAmount) {
          const coin = Math.floor(10 * price * transferAmount);
          userToVerify.coin += coin;
          userToVerify.ink.verified = true;
          userToVerify.save();
          console.log(`${userToVerify.telegram.firstName} verified wallet and received ${coin} Coins. hash: ${log.transactionHash}`);
          sendMessage(userToVerify.telegram.id, `Your wallet is verified and received ${coin} Coins. hash: ${log.transactionHash}`);
        } else {
          sendMessage(userToVerify.telegram.id, `You need to send at least $1 worth of $Shroomy tokens to verify wallet.`);
        }
      }
    }

    const blockNumber = await client.getBlockNumber();
    config.lastBlockNumber = Number(blockNumber);
    config.save();
  } catch (err) {
    console.error('Error while fetching transactions:', err.message);
  }
}

module.exports.getBalance = async (address) => {
  try {
    const data = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: 'balanceOf',
      args: [address]
    });

    return parseInt(formatEther(data));
  } catch (err) {
    console.error('Error while fetching balance:', err.message);
    return 0;
  }
}