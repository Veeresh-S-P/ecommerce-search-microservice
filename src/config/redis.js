const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

redisClient.connect()
  .then(() => console.log("Redis connected successfully"))
  .catch((err) => {
    console.error("Redis connection failed:", err.message);
  });

module.exports = { redisClient };