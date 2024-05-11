import "only-server";
import { createClient } from "redis";
import { Redis } from "ioredis";

// const redis = createClient({
//   username: "", // use your Redis user. More info https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/
//   password: "", // use your password here
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: 6379,
//   },
// });

const redis = new Redis({
  port: 6379, // Redis port
  host: process.env.REDIS_HOST, // Redis host
  username: "", // needs Redis >= 6
  password: "",
  db: 0, // Defaults to 0
});

redis.on("error", (err) => {
  console.log(err);
});


export { redis };
