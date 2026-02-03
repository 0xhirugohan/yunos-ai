import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from "ai";
import { useEffect, useState } from "react";

import { Chat } from "@/components/ui/chat";

export function ChatbotUI() {
  const [input, setInput] = useState('');
  const {
    messages,
    sendMessage,
    status,
    stop,
    addToolApprovalResponse,
    addToolOutput,
    resumeStream,
    regenerate,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/vercel/stream',
    }),

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,

    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;

      if (toolCall.toolName === "get_location_tool") {
        const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];

	addToolOutput({
	  tool: toolCall.toolName,
	  toolCallId: toolCall.toolCallId,
	  output: { name: cities[Math.floor(Math.random() * cities.length)] },
	});
      }
    },
  });

  const handleApproval = e => {
    addToolApprovalResponse(e);
  }

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
	isGenerating={status === "streaming"}
	setToolApprovalResponse={handleApproval}
	stop={stop}
      />     
    </div>
  );
};
