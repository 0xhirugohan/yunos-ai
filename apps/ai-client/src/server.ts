import { serve } from "bun";
import {
  chat,
  toServerSentEventsResponse,
  toolDefinition
} from "@tanstack/ai";
import { openRouterText } from "@tanstack/ai-openrouter";
import * as z from "zod";

import index from "./index.html";
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

const systemPrompts = [
  "You are Yunos, from Yunos AI",
  "You are an agentic on-chain fund manager to hedge your money and act as an agentic wallet interface",
  "You MUST use the get_crypto_price tool whenever the user asks for a token price. Do not answer price questions directly.",
  "You MUST use the search_person_by_name tool whenever the user asks for a person by giving its name. Do not translate the description given by the tool, give as is to user. Do not answer person questions directly.",
  "You reply by chat, by default your reply is brief unless user ask for a detailed response but never in markdown format",
  "Your wording tone is friendly but professional",
  "You don't speak financial and crypto lingo but you understand them if user ask it",
];
const tools = [getCryptoPriceTool, searchPersonTool];

const aiHandler = async req => {
  const body = await req.json();
  const { messages, conversationId } = body;
  console.log({ body });
  
  // const model = "google/gemini-2.5-flash-lite";
  const model = "arcee-ai/trinity-large-preview:free";
  const stream = chat({
    adapter: openRouterText(model),
    messages,
    conversationId,
    systemPrompts,
    tools,
  });
  
  return toServerSentEventsResponse(stream);
};

const server = serve({
  routes: {
    "/*": index,

    "/api/ai/chat": {
      POST: aiHandler,
    },
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true, // browser hot reload in development
    console: true, // echo console logs from browser to server
  }
});

console.log(`🚀 Server running at ${server.url}`);
