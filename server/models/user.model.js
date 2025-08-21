const mongoose = require('mongoose');

const TelegramUserSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, required: true },
    username: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    isPremium: { type: Boolean, default: false },
    isBot: { type: Boolean, default: false },
    photoUrl: { type: String, default: '' },
  },
  { _id: false }
);

const ScoreSchema = new mongoose.Schema(
  {
    week: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const TaskSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    completedAt: { type: Date, default: Date.now },
    isClaimed: { type: Boolean, default: false }
  },
  { _id: false }
);

const LoginSchema = new mongoose.Schema(
  {
    lastLoginAt: { type: Date },
    streak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const WalletSchema = new mongoose.Schema(
  {
    address: { type: String, default: '' },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    telegram: { type: TelegramUserSchema, required: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    friends: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
    coin: { type: Number, default: 0 },
    score: { type: ScoreSchema, default: {} },
    tasks: { type: [TaskSchema], default: [] },
    login: { type: LoginSchema, default: {} },
    wallet: { type: WalletSchema, default: {} },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Method to add point with totalScore, weeklyScore, monthlyScore
UserSchema.methods.addScore = async function (value) {
  this.score.week = Math.max(this.score.week, value);
  this.score.month = Math.max(this.score.month, value);
  this.score.total = Math.max(this.score.total, value);
  return this;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
