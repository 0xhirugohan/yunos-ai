import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from "ai";
import { useEffect, useState } from "react";
import { useConnect, useConnectors, useConnection } from "wagmi";

import { Chat } from "@/components/ui/chat";

export function ChatbotUI() {
  const { connect } = useConnect();
  const connectors = useConnectors();
  const { address: connectedAddress } = useConnection();

  const [input, setInput] = useState('');
  const {
    messages,
    setMessages,
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
    // sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      
      if (toolCall.toolName === "get_connected_wallet_address_tool") {
        console.log("get_connected_wallet_address");

	let address = "";
	let isConnected = false;
        if (connectedAddress !== undefined) {
	  address = connectedAddress;
	  isConnected = true;
	}

	// addToolOutput({ address, isConnected });
	addToolOutput(address);

	// sendMessage();
	setMessages(messages);
      }

      if (toolCall.toolName === "connect_wallet_tool") {
        console.log("connect_wallet_tool");

	connect({ connector: connectors[0] });

	addToolOutput({
	  address: "",
	  isConnected: false,
	});

        sendMessage();
      }

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
