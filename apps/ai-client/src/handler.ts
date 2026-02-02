import {
  chat,
  toServerSentEventsResponse,
  toolDefinition,
  maxIterations,
} from "@tanstack/ai";
import { openRouterText } from "@tanstack/ai-openrouter";
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

import { getCryptoPriceDef, searchPersonDef } from "@/tool";

const getCryptoPriceTool = getCryptoPriceDef.server(({ symbol }) => {
  console.log("calling get crypto price");
  return { symbol, price: 6969 };
});

const searchPersonTool = searchPersonDef.server(({ name }) => {
  const userName = name.toLowerCase();
  let description = "we can't lookup that name";
  return JSON.stringify({ name: userName, description });
});

const weatherTool = tool({
  name: "Weather Tool",
  description: "Get the current weather in a given location",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
    unit: z.enum(["celcius", "fahrenheit"]).optional(),
  }),
  inputExamples: [
    { input: { location: "San Francisco, CA" } },
    { input: { location: "Boston, MA" } },
  ],
  outputSchema: z.object({
    location: z.string(),
    unit: z.enum(["celcius", "fahrenheit"]),
    degree: z.number(),
  }),
  strict: true,
  execute: async ({ location, unit = "celcius" }) => {
    console.log("calling weatherTool", location);
    const weatherData = {
      "Boston": {
        celcius: "15 celcius",
	fahrenheit: "59 fahrenheit",
      },
      "San Francisco": {
        celcius: "19 celcius",
	fahrenheit: "64 fahrenheit",
      },
    };

    const weather = weatherData[location];
    const degree = Math.floor(Math.random() * 40);
    return { location, unit, degree };
  },
});

const systemPrompts = [
  "You are Yunos, from Yunos AI.",
  "You are an agentic on-chain fund manager to hedge your money and act as an agentic wallet interface.",
  "You MUST use the weather_tool tool whenever the user asks for the weather. Do not answer weather questions directly.",
  "You MUST use the get_crypto_price tool whenever the user asks for a token price. Do not answer price questions directly.",
  "You MUST use the search_person_by_name tool whenever the user asks for a person by giving its name. Do not translate the description given by the tool, give as is to user. Do not answer person questions directly.",
  "You reply by chat, by default your reply is brief unless user ask for a detailed response but never in markdown format.",
  "Your wording tone is friendly but professional.",
  "You don't speak financial and crypto lingo but you understand them if user ask it.",
  "You MUST not use markdown format. NO `**BOLD**` formatting.",
];
const tools = [getCryptoPriceTool, searchPersonTool];
const model = "arcee-ai/trinity-large-preview:free";

const aiHandler = async req => {
  const body = await req.json();
  const { messages, conversationId } = body;
  console.log({ body });
  
  // const model = "google/gemini-2.5-flash-lite";
  const stream = chat({
    adapter: openRouterText(model),
    messages,
    conversationId,
    systemPrompts,
    tools,
    agentLoopStrategy: maxIterations(10),
  });
  
  return toServerSentEventsResponse(stream);
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
    model: openrouter.chat(model),
    system: systemPrompts.join(" "),
    messages,
    tools: { weather_tool: weatherTool },
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
    model: openrouter(model),
    system: systemPrompts.join(" "),
    messages: await convertToModelMessages(messages),
    tools: { weather_tool: weatherTool },
    toolChoice: ["weather_tool"],
  });

  return response.toUIMessageStreamResponse();
};

export {
  aiHandler,
  vercelAiChatHandler,
  vercelAiStreamHandler,
}
