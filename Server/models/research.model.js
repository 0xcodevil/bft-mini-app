const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema(
  {
    amount: { type: Number, default: 0, min: 0 },
    chance: { type: Number, default: 0, min: 0, max: 1 },
  },
  { _id: false }
)

const ResearchSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    logo: { type: String, required: true },
    preview: { type: String, required: true },
    dna: { type: Number, required: true },
    coin: { type: Number, required: true },
    essence: { type: Number, required: true },
    chance: { type: Number, required: true },
    chanceBonus: { type: Number, required: true },
    chanceStep: { type: Number, required: true },
    maxLevel: { type: Number, required: true },
    xp: { type: Number, required: true },
    duration: { type: Number, required: true },
    reward: {
      coin: { type: RewardSchema, default: {} },
      spore: { type: RewardSchema, default: {} },
      essence: { type: RewardSchema, default: {} },
    }
  }
);

const Research = mongoose.model('Research', ResearchSchema);
module.exports = Research;