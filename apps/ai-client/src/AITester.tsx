import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { clientTools, createChatClientOptions } from "@tanstack/ai-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Chat } from "@/components/ui/chat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getXAUTPriceDef } from "@/tool";

const MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B" },
]

interface FormattedMessage {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
}

export function AITester() {
  const [input, setInput] = useState<string>("");
  const [formattedMessages, setFormattedMessages] = useState<FormattedMessage[]>([]);

  const getXAUTPrice = getXAUTPriceDef.client(() => {
    return { price: 3700 };
  });

  const tools = clientTools(getXAUTPrice);
  const chatOptions = createChatClientOptions({
    connection: fetchServerSentEvents("/api/ai/chat"),
    tools,
  });

  const {
    messages,
    sendMessage,
    append,
    stop,
    isLoading
  } = useChat(chatOptions);

  const formatMessages = useCallback((currentMessages) => {
    const newFormattedMessages = [];
    let idCounter = 0;
    for (let messageIndex = 0; messageIndex < messages.length; messageIndex++) {
      const message = messages[messageIndex];
      console.log({ message });
      if (!message.parts) continue;

      for (let partIndex = 0; partIndex < message.parts.length; partIndex++) {
        const part = message.parts[partIndex];
	if (part.type != "text") continue;

	idCounter++;
	const newMessage = {
	  id: "" + idCounter,
	  role: message.role,
	  content: part.content,
	  createdAt: message.createdAt,
	};
	newFormattedMessages.push(newMessage);
      }
    }

    return newFormattedMessages;
  }, [messages]);

  useEffect(() => {
    const formatResult = formatMessages(messages);
    setFormattedMessages(formatResult);
  }, [messages]);

  const handleInputChange = newInput => {
    setInput(newInput.target.value);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Chat
	messages={formattedMessages}
	handleSubmit={handleSubmit}
	input={input}
	handleInputChange={handleInputChange}
	isGenerating={isLoading}
	stop={stop}
      />
    </div>
  );
}
