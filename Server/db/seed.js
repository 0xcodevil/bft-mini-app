require('dotenv').config({ path: '../.env' });

const DB = require('../config/db');
const Task = require('../models/task.model');

const taskSeed = require('./task.json');

const main = async () => {
  await DB.connect(process.env.MONGO_URL);

  await Task.deleteMany();
  await Task.insertMany(taskSeed);
  console.log('Task collection migrated.');

  // await Shroom.deleteMany();
  // await Shroom.insertMany(shroomSeed);
  // console.log('Shroom collection migrated.');

  // await Badge.deleteMany();
  // await Badge.insertMany(badgeSeed);
  // console.log('Badge collection migrated.');

  // await Research.deleteMany();
  // await Research.insertMany(researchSeed);
  // console.log('Research collection migrated.');
}

main().then(() => {
  console.log('✅ Success!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});