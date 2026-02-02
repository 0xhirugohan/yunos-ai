import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useState } from "react";

export function Chatbot() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/vercel/stream',
    }),

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
    },
  });
  const [input, setInput] = useState('');

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
	  <strong>{`${message.role}:`}</strong>
	  {message.parts.map((part, index) => {
	    switch (part.type) {
	      case "text":
	        return part.text;

	      case "tool-askForConfirmation":
	        return "confirm";

	      case "tool-getLocation":
	        return "get location";

	      case "tool-weather_tool": {
	        const callId = part.toolCallId;
		
		switch (part.state) {
		  case "input-streaming":
		    return (
		      <pre key={callId}>{JSON.stringify(part, null, 2)}</pre>
		    );
		  case "input-available":
	            return (
		      <div key={callId}>
		        Getting weather information for {part.input.location}...
		      </div>
		    );
		  case "output-available":
		    return (
		      <div key={callId}>
		        Weather in {part.input.location}: {part.output}
		      </div>
		    );
		  case "output-error":
		    return (
		      <div key={callId}>
		        Error getting weather for {part.input.location}:{' '}
			{part.errorText}
		      </div>
		    );
		}
		break;
	      }
	    }
	  })}
	  <br />
	</div>
      ))}

      {(status === "submitted" || status === "streaming") && (
        <div>
	  {status === "submitted" && <span>loading...</span>}
	  <button
	    type="button"
	    onClick={() => stop()}
	  >
	    Stop
	  </button>
	</div>
      )}

      <form
        onSubmit={e => {
	  e.preventDefault();
	  if (input.trim()) {
	    sendMessage({ text: input });
	    setInput("");
	  }

	  return false;
	}}
      >
        <input
	  value={input}
	  onChange={e => setInput(e.target.value)}
	  disabled={status !== "ready"}
	  placeholder="Say something..."
	/>
	<button type="submit" disabled={status !== "ready"}>
	  Submit
	</button>
      </form>
    </>
  );
};
