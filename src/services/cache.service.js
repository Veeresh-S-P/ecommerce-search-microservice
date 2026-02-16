const { redisClient } = require("../config/redis");

const getCache = async (key) => {
  return await redisClient.get(key);
};

const setCache = async (key, value, ttl = 300) => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
};

module.exports = { getCache, setCache };