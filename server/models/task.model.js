const mongoose = require('mongoose');
const { TASK_TYPE } = require('../config/constants');

const TaskSchema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.values(TASK_TYPE), required: true },
    title: { type: String, required: true },
    link: { type: String },
    icon: { type: String },
    target: { type: Number },
    reward: {
      coin: { type: Number },
    },
  }
);

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;