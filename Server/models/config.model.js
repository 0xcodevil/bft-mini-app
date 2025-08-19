const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  _id: { type: String, default: "config" }, // Singleton document
  price: { type: Number, default: 0 },
  lastBlockNumber: { type: Number, default: 1 }
});

const Config = mongoose.model('Config', ConfigSchema);
module.exports = Config;