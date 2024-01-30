import { Bedrock } from "@langchain/community/llms/bedrock";
import { RetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import readline from "readline/promises";
import { redis, redisStore } from "./redis-store";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const llamaChat = new Bedrock({
  model: "meta.llama2-70b-chat-v1",
  region: "us-east-1",
  temperature: 0.3,
  maxTokens: 2048,
  credentials: {
    accessKeyId: String(process.env.BEDROCK_AWS_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.BEDROCK_AWS_SECRET_ACCESS_KEY),
  },
});

const prompt = new PromptTemplate({
  template: `
    [INST]Você responde perguntas sobre um arquivo.
    O usuário foi quem te enviou o arquivo.
    Use o conteúdo do arquivo abaixo para responder as pergunta do usuário.
    Se a resposta não for encontrada no conteúdo do arquivo, responda com "Não sei", não tente inventar uma resposta.
    Responda em português.

    Conteúdo do arquivo:
    {context}

    Pergunta do usuário:
    {question}
    [/INST]
  `.trim(),
  inputVariables: ["context", "question"],
});

const chain = RetrievalQAChain.fromLLM(llamaChat, redisStore.asRetriever(), {
  prompt,
  // returnSourceDocuments: true,
  // verbose: true,
});

async function chat() {
  await redis.connect();

  const question = await rl.question("Pergunta: ");

  const response = await chain.call({
    query: question,
  });

  console.log("Resposta:", response);

  await redis.disconnect();
}

chat();
