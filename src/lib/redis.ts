import "only-server";
import { createClient } from "redis";

const redis = createClient({
  username: "", // use your Redis user. More info https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/
  password: "", // use your password here
  socket: {
    host: "redis-stack",
    port: 6379,
  },
});

redis.on("error", (err) => {
  console.log(err);
});

const createCache = (key: string, value: string) => {
  return redis.set(key, value, { EX: 60 * 60 * 24 * 3 });
};

const getCache = (key: string) => redis.get(key);

export { createCache, getCache, redis };
