const express = require('express');
const router = express.Router();

const {
  getSocialTasks,
  visitSocialTask,
  claimSocialTask,
  getDailyTasks,
  claimDailyTask,
  getWeeklyTasks,
  claimWeeklyTask,
  getInviteTask,
  claimInviteTask,
} = require('../controllers/task.controller');

router.get('/social', getSocialTasks);
router.post('/social', visitSocialTask);
router.post('/social/claim', claimSocialTask);
router.get('/daily', getDailyTasks);
router.post('/daily/claim', claimDailyTask);
router.get('/weekly', getWeeklyTasks);
router.post('/weekly/claim', claimWeeklyTask);
router.get('/invite', getInviteTask);
router.post('/invite/claim', claimInviteTask);

module.exports = router;