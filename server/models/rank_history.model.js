const mongoose = require('mongoose');
const { TAP_RANKING_TYPE } = require('../config/constants')

const RankHistorySchema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.values(TAP_RANKING_TYPE), required: true },
    rank: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  },
  {
    timestamps: true
  }
);

const RankHistory = mongoose.model('RankHistory', RankHistorySchema);
module.exports = RankHistory;