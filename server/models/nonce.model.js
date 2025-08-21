const mongoose = require('mongoose');

const NonceSchema = new mongoose.Schema(
  {
    address: { type: String, required: true, unique: true },
    nonce: { type: String, required: true }
  }
);

const Nonce = mongoose.model('Nonce', NonceSchema);
module.exports = Nonce;