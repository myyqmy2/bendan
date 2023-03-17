import type { NextRequest } from "next/server";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

console.log('key', process.env.OPENAI_API_KEY);
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest): Promise<Response> => {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    // model:"text-chat-davinci-002-20221122",
    // model: "text-davinci-003",
    // model:"text-curie-001",
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    // prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 800,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
