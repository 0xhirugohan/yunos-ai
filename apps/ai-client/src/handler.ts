import * as z from "zod";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  generateText,
  streamText,
  stepCountIs,
  tool,
} from "ai";
import type { UIMessage } from "ai";

import {
  connectWalletTool,
  getConnectedWalletAddressTool,
  weatherTool,
  askForConfirmationTool,
  getLocationTool,
} from "@/tool";
import { SYSTEM_PROMPTS, MODEL_NAME } from "@/constant";

const tools = {
  connect_wallet_tool: connectWalletTool,
  get_connected_wallet_address_tool: getConnectedWalletAddressTool,
  // weather_tool: weatherTool,
  // ask_for_confirmation_tool: askForConfirmationTool,
  // get_location_tool: getLocationTool,
};

const vercelAiChatHandler = async req => {
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const messages = [
    { role: "user", content: "Hi!" },
    { role: "assistant", content: "Hello, I'm Yunos, how can I help?" },
    { role: "user", content: "What is the weather in SF?" },
  ];

  const { text } = await generateText({
    model: openrouter.chat(MODEL_NAME),
    system: SYSTEM_PROMPTS.join(" "),
    messages,
    tools,
    stopWhen: stepCountIs(5),
    // prompt: "Who are you?",
  });

  return Response.json({ message: text });
};

const vercelAiStreamHandler = async req => {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const response = streamText({
    model: openrouter(MODEL_NAME),
    system: SYSTEM_PROMPTS.join(" "),
    messages: await convertToModelMessages(messages),
    tools,
    toolChoice: ["connect_wallet_tool", "get_connected_wallet_address_tool"],
  });

  return response.toUIMessageStreamResponse();
};

export {
  vercelAiChatHandler,
  vercelAiStreamHandler,
}
