import path from "node:path";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TokenTextSplitter } from "langchain/text_splitter";
import { RedisVectorStore } from "langchain/vectorstores/redis";

import { createClient } from "redis";

const loader = new PDFLoader(path.resolve(__dirname, "../", "pdfs", "tcc.pdf"));

async function load() {
  const docs = await loader.load();

  const splitter = new TokenTextSplitter({
    encodingName: "cl100k_base",
    chunkSize: 600,
    chunkOverlap: 100,
  });

  const splittedDocs = await splitter.splitDocuments(docs);

  const redis = createClient({
    url: "redis://127.0.0.1:6379",
  });

  await redis.connect();

  const model = new HuggingFaceTransformersEmbeddings({
    modelName: "Xenova/all-MiniLM-L6-v2",
  });

  await RedisVectorStore.fromDocuments(splittedDocs, model, {
    indexName: "pdf-file",
    redisClient: redis,
    keyPrefix: "pdf:",
  });

  await redis.disconnect();
}

load();
