import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { openRouterText } from "@tanstack/ai-openrouter";

const aiHandler = () => {
  const stream = chat({
    adapter: openRouterText("arcee-ai/trinity-large-preview:free"),
    messages: [{ role: "user", content: "Hello!" }],
  });
  
  return toServerSentEventsResponse(stream);
};

const routes = {
  "/api/status": Response.json({ status: "OK" }, { status: 200 }),
  "/api/ai": aiHandler,
  "/*": Response.json({ message: "Endpoint is not defined" }, { status: 404 }),
};

const server = Bun.serve({
  routes,
});

console.log(`Server running at ${server.url}`);
