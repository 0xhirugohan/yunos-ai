import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, type FormEvent } from "react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";

export function AITester() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/api/ai/chat"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
	  <div
	    key={message.id}
	    className={`mb-4 ${
	      message.role === "assistant" ? "text-blue-600" : "text-gray-800"
	    }`}
	  >
	    <div className="font-semibold mb-1">
	      {message.role === "assistant" ? "Assistant" : "You"}
	    </div>
	    <div>
	      {message.parts.map((part, idx) => {
	        if (part.type === "thinking") {
		  return (
		    <div
		      key={idx}
		      className="text-sm text-gray-500 italic mb-2"
		    >
		      💭 Thinking: {part.content}
		    </div>
		  );
		}
		if (part.type === "text") {
		  return <div key={idx}>{part.content}</div>;
		}
		return null;
	      })}
	    </div>
	  </div>
	))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Label htmlFor="chat" className="sr-only">
	  Chat
	</Label>
	<Input
	  id="chat"
	  type="text"
	  name="chat"
	  onChange={(e) => setInput(e.target.value)}
	  placeholder="Type a message..."
	  disabled={isLoading}
        />
	<Button
	  type="submit"
	  disabled={!input.trim() || isLoading}
	  variant="secondary"
	>
	  Send
	</Button>
      </form>
    </div>
  );
}
