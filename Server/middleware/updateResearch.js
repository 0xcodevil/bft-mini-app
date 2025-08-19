const Research = require('../models/research.model');
const { LAB } = require('../config');

module.exports = async (req, res, next) => {
  const result = {
    name: "",
    success: false,
    isUpgraded: false,
    coin: 0,
    spore: 0,
    essence: 0,
  }

  const now = Date.now();
  const research = req.user.research;
  const researches = await Research.find({}).select('-_id -__v').lean();

  if (research.isUpgrading && now - research.upgradedAt > LAB.UPGRADE_COOLDOWN) {
    research.isUpgrading = false;
    research.laboratoryLevel++;
    result.isUpgraded = true;
  }

  research.items.forEach((item) => {
    if (item.isUpgrading && now - item.upgradedAt > LAB.UPGRADE_COOLDOWN) {
      item.isUpgrading = false;
      const ui = researches.find(r => r.id === item.itemId);
      result.name = ui.title;
      const chance = ui.chance + Math.max(research.laboratoryLevel - 1, 0) * ui.chanceBonus - item.level * ui.chanceStep;
      if (Math.random() < chance) {
        item.level++;
        result.success = true;
        if (Math.random() < ui.reward.coin.chance) {
          req.user.coin += ui.reward.coin.amount;
          result.coin = ui.reward.coin.amount;
        }
        if (Math.random() < ui.reward.spore.chance) {
          req.user.farm.spore += ui.reward.spore.amount;
          result.spore = ui.reward.spore.amount;
        }
        if (Math.random() < ui.reward.essence.chance) {
          req.user.farm.essence += ui.reward.essence.amount;
          result.essence = ui.reward.essence.amount;
        }
      }
      req.result = result;
    }
  });

  await req.user.save();

  next();
}