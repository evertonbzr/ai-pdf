import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { RedisVectorStore } from "@langchain/community/vectorstores/redis";

import { createClient } from "redis";

export const redis = createClient({
  url: "redis://127.0.0.1:6379",
});

const model = new HuggingFaceTransformersEmbeddings({
  modelName: "Xenova/all-MiniLM-L6-v2",
});

export const redisStore = new RedisVectorStore(model, {
  indexName: "pdf-file",
  redisClient: redis,
  keyPrefix: "pdf:",
});
