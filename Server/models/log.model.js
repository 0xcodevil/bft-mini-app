const mongoose = require('mongoose');
const { LOG_TYPE } = require('../config/constants');

const LogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: Object.values(LOG_TYPE), required: true },
    data: { type: mongoose.Schema.Types.Mixed }
  },
  {
    timestamps: true
  }
);

const Log = mongoose.model('Log', LogSchema);
module.exports = Log;