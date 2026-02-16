const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("connect", () => {
  console.log("Redis Connected Successfully")
});



redisClient.on("error", (err) => {
  console.error("Redis Error:",err.message);
});

const connectRedis = async () => {
  await redisClient.connect()
};

module.exports={ redisClient,connectRedis}