import { serve } from "bun";

import index from "./index.html";
import {
  aiHandler,
  vercelAiChatHandler,
  vercelAiStreamHandler,
} from "@/handler";

const server = serve({
  routes: {
    "/*": index,

    "/api/vercel/chat": {
      POST: vercelAiChatHandler,
    },
    "/api/vercel/stream": {
      POST: vercelAiStreamHandler,
    },
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true, // browser hot reload in development
    console: true, // echo console logs from browser to server
  }
});

console.log(`🚀 Server running at ${server.url}`);
