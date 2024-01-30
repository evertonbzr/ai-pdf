import { redis, redisStore } from "./redis-store";

async function search() {
  await redis.connect();

  const response = await redisStore.similaritySearchWithScore(
    "Quais os requisitos funcionais",
    5
  );

  console.log(response);

  await redis.disconnect();
}

search();
