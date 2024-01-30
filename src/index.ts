import { Bedrock } from "@langchain/community/llms/bedrock";

const model = new Bedrock({
  model: "amazon.titan-text-express-v1",
  region: "us-east-1",
  temperature: 0.3,
  maxTokens: 512,
  credentials: {
    accessKeyId: String(process.env.BEDROCK_AWS_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.BEDROCK_AWS_SECRET_ACCESS_KEY),
  },
});

(async () => {
  const res = await model.invoke(
    `
`.trim()
  );
  console.log(res);
})();
