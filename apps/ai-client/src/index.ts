import { serve } from "bun";
import { chat, toServerSentEventsResponse, toolDefinition } from "@tanstack/ai";
import { openRouterText } from "@tanstack/ai-openrouter";
import { z } from "zod";
import index from "./index.html";

const getXAUTPriceInputSchema: JSONSchema = {
  type: "object",
  properties: {
    time: {
      type: "date",
      description: "the time of price being asked, default latest (right now)",
    },
  },
};

const getXAUTPriceOutputSchema: JSONSchema = {
  type: "object",
  properties: {
    price: {
      type: "number",
      description: "the price of XAUT in USD"
    },
  },
  required: ["price"],
};

export const getXAUTPriceDef = toolDefinition({
  name: 'get_XAUTPrice',
  description: 'Get the latest price of XAUT token or known as Gold',
  inputSchema: getXAUTPriceInputSchema,
  outputSchema: getXAUTPriceOutputSchema,
});

// Define schemas using JSON Schema
const inputSchema: JSONSchema = {
  type: "object",
  properties: {
    location: {
      type: "string",
      description: "The city and state, e.g. San Francisco, CA",
    },
    unit: {
      type: "string",
      enum: ["celsius", "fahrenheit"],
    },
  },
  required: ["location"],
};

const outputSchema: JSONSchema = {
  type: "object",
  properties: {
    temperature: { type: "number" },
    conditions: { type: "string" },
    location: { type: "string" },
  },
  required: ["temperature", "conditions", "location"],
};

// Create the tool definition
const getWeatherDef = toolDefinition({
  name: "get_weather",
  description: "Get the current weather for a location",
  inputSchema,
  outputSchema,
});



const aiHandler = async req => {
  const { messages, conversationId } = await req.json();

  const getXAUTPrice = getXAUTPriceDef.server(async () => {
    console.log("getting XAUT Price");
    return { price: 4900 };
  });

  // Create server implementation (args is typed as `any` with JSON Schema)
  const getWeather = getWeatherDef.server(async (args) => {
    console.log("calling getWeather");
    const { location, unit } = args;
    const response = await fetch(
      `https://api.weather.com/v1/current?location=${location}&unit=${unit || "fahrenheit"}`
    );
    return await response.json();
  });

  const stream = chat({
    // adapter: openRouterText("google/gemma-3n-e2b-it:free"),//openRouterText("arcee-ai/trinity-large-preview:free"),
    adapter: openRouterText("arcee-ai/trinity-large-preview:free"),
    messages,
    conversationId,
    systemPrompts: [
      "You are Yunos, from Yunos AI",
      "You are an agentic on-chain fund manager to hedge your money and act as an agentic wallet interface",
      "You reply by chat, by default your reply is brief unless user ask for a detailed response but never in markdown format",
      "Your wording tone is friendly but professional",
      "You don't speak financial and crypto lingo but you understand them if user ask it",
      "If user ask you about prices, use tools to get prices",
    ],
    tools: [
      // getXAUTPrice,
      getWeather,
    ],
  });
  
  return toServerSentEventsResponse(stream);
};

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/ai/chat": {
      POST: aiHandler
    },

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
