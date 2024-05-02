import "only-server";
import { createClient } from "redis";

const redis = createClient({
    username: "",
    password: "",
});

redis.on("error", (err) => {
  console.log(err);
});

const createCache = (key: string, value: string) => {
  return redis.set(key, value, { EX: 60 * 60 * 24 * 3 });
};

const getCache = (key: string) => redis.get(key);

export { createCache, getCache, redis };
