const User = require("../models/user.model");
const Weather = require("../models/weather.model");
const { FARM } = require('../config');
const { TIME, SHROOMY_STATUS, WEATHER_TYPE } = require('../config/constants');

const getRandomEventCount = (chance, n) => {
  return Array.from({ length: n }).filter(() => Math.random() < chance).length;
}

const getRandomKeys = (length, n) => {
  return new Array(length).fill(0).map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, n);
}

module.exports = async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('farm.shroomies.shroomId');

  const now = Date.now();

  var timeElapsed = now - user.farm.updatedAt;
  if (timeElapsed < TIME.MIN) return next();

  const shroomies = user.farm.shroomies.filter(shroom => !!shroom.shroomId?._id);

  if (user.farm.boosted && now > user.farm.boostedAt + FARM.BOOST_DURATION) {
    user.farm.boosted = false;
    shroomies.forEach((shroom, index) => {
      const elapsed = shroom.elapsed + Math.floor(FARM.BOOST_DURATION / TIME.MIN) * 2;
      if (shroom.status !== SHROOMY_STATUS.SLEEPING) shroomies[index].elapsed = elapsed;
    });
  }

  const waterPerMin = shroomies.reduce((sum, shroom) => {
    let usage = shroom.status === SHROOMY_STATUS.SLEEPING ? 0 : shroom.shroomId.water
    return sum + usage;
  }, 0);

  let secElapsed, minElapsed;
  const weathers = await Weather.find({ $expr: { $gt: [{ $add: ["$startedAt", { $multiply: ["$duration", TIME.HOUR] }] }, user.farm.updatedAt] } }).sort({ startedAt: 1 }).lean();

  if (weathers.length > 0) {
    weathers.forEach(weather => {
      if (user.farm.updatedAt < weather.startedAt) {
        secElapsed = weather.startedAt - user.farm.updatedAt;
        minElapsed = Math.floor(secElapsed / TIME.MIN);
        user.farm.water = Math.max(0, user.farm.water - minElapsed * waterPerMin);
        user.farm.updatedAt = (user.farm.updatedAt + secElapsed - secElapsed % TIME.MIN);

        shroomies.forEach((shroom, index) => {
          const elapsed = shroom.elapsed + minElapsed;
          let status;

          if (shroom.status === SHROOMY_STATUS.DEAD) status = SHROOMY_STATUS.DEAD;
          else if (shroom.status === SHROOMY_STATUS.SLEEPING) status = SHROOMY_STATUS.SLEEPING;
          else if (user.farm.water === 0) status = SHROOMY_STATUS.DEAD;
          else if (elapsed > (shroom.shroomId.cooldown + FARM.CLAIMABLE_DURATION)) status = SHROOMY_STATUS.DEAD;
          else if (elapsed >= shroom.shroomId.cooldown) status = SHROOMY_STATUS.CLAIMABLE;
          else if (shroom.status === SHROOMY_STATUS.SHOCKED) status = SHROOMY_STATUS.SHOCKED;
          else status = SHROOMY_STATUS.GROWING;

          if (status !== SHROOMY_STATUS.SLEEPING) shroomies[index].elapsed = elapsed;
          shroomies[index].status = status;
        });
      }

      secElapsed = Math.min(now, weather.startedAt + weather.duration * TIME.HOUR) - user.farm.updatedAt;
      minElapsed = Math.floor(secElapsed / TIME.MIN);

      var deadKeys = [];
      if (weather.type === WEATHER_TYPE.STORM) {
        const totalCount = Math.min(weather.duration, Math.floor((now - weather.startedAt) / TIME.HOUR));
        const lastCount = Math.min(weather.duration, Math.floor((user.farm.updatedAt - weather.startedAt) / TIME.HOUR));
        const deadCount = getRandomEventCount(weather.killChance, totalCount - lastCount);
        deadKeys = getRandomKeys(shroomies.length, deadCount);
      }

      user.farm.water = Math.max(0, user.farm.water - minElapsed * waterPerMin * (weather.waterMultiplier ?? 1));
      user.farm.updatedAt = (user.farm.updatedAt + secElapsed - secElapsed % TIME.MIN);

      shroomies.forEach((shroom, index) => {
        const elapsed = shroom.elapsed + minElapsed * (weather.growthMultiplier ?? 1);
        let status;

        if (shroom.status === SHROOMY_STATUS.DEAD) status = SHROOMY_STATUS.DEAD;
        else if (deadKeys.includes(index)) status = SHROOMY_STATUS.SHOCKED;
        else if (shroom.status === SHROOMY_STATUS.SLEEPING) status = SHROOMY_STATUS.SLEEPING;
        else if (user.farm.water === 0) status = SHROOMY_STATUS.DEAD;
        else if (elapsed > (shroom.shroomId.cooldown + FARM.CLAIMABLE_DURATION)) status = SHROOMY_STATUS.DEAD;
        else if (elapsed >= shroom.shroomId.cooldown) status = SHROOMY_STATUS.CLAIMABLE;
        else if (shroom.status === SHROOMY_STATUS.SHOCKED) status = SHROOMY_STATUS.SHOCKED;
        else status = SHROOMY_STATUS.GROWING;

        if (status !== SHROOMY_STATUS.SLEEPING && status !== SHROOMY_STATUS.SHOCKED) shroomies[index].elapsed = elapsed;
        shroomies[index].status = status;
      });
    });
  }

  secElapsed = now - user.farm.updatedAt;
  minElapsed = Math.floor(secElapsed / TIME.MIN);
  user.farm.water = Math.max(0, user.farm.water - minElapsed * waterPerMin);
  user.farm.updatedAt = (user.farm.updatedAt + secElapsed - secElapsed % TIME.MIN);

  shroomies.forEach((shroom, index) => {
    const elapsed = shroom.elapsed + minElapsed;
    let status;

    if (shroom.status === SHROOMY_STATUS.DEAD) status = SHROOMY_STATUS.DEAD;
    else if (shroom.status === SHROOMY_STATUS.SLEEPING) status = SHROOMY_STATUS.SLEEPING;
    else if (user.farm.water === 0) status = SHROOMY_STATUS.DEAD;
    else if (elapsed > (shroom.shroomId.cooldown + FARM.CLAIMABLE_DURATION)) status = SHROOMY_STATUS.DEAD;
    else if (elapsed >= shroom.shroomId.cooldown) status = SHROOMY_STATUS.CLAIMABLE;
    else if (shroom.status === SHROOMY_STATUS.SHOCKED) status = SHROOMY_STATUS.SHOCKED;
    else status = SHROOMY_STATUS.GROWING;

    if (status !== SHROOMY_STATUS.SLEEPING && status !== SHROOMY_STATUS.SHOCKED) shroomies[index].elapsed = elapsed;
    shroomies[index].status = status;
  });

  await user.save();
  req.user = user;
  next();
}