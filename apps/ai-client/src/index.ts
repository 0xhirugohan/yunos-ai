import { serve } from "bun";
import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { openRouterText } from "@tanstack/ai-openrouter";
import index from "./index.html";

const aiHandler = async req => {
  const { messages, conversationId } = await req.json();

  const stream = chat({
    adapter: openRouterText("arcee-ai/trinity-large-preview:free"),
    messages,
    conversationId,
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
