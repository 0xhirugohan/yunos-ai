import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useEffect, useState } from "react";

import { Chat } from "@/components/ui/chat";

export function ChatbotUI() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/vercel/stream',
    }),

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleInputChange = e => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col gap-6">
      <Chat
        messages={messages}
	handleSubmit={handleSubmit}
	input={input}
	handleInputChange={handleInputChange}
	isGenerating={status !== "ready"}
	stop={stop}
      />     
    </div>
  );
};
