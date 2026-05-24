"use client";

import type { GlobeCoords } from "@/components/Globe";
import { useState } from "react";
import ConversationView from "./Chat/ConversationView";

export type Turn = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type Conversation = {
  turns: Turn[];
};

type ChatPopUpProps = {
  conversation?: Conversation;
  coords?: GlobeCoords | null;
  onClose?: () => void;
};

async function onMessageSend(coords: GlobeCoords, userInput: string) {
  const params = new URLSearchParams({
    latitude: String(coords.lat),
    longitude: String(coords.lng),
    user_input: userInput,
  });
  const response = await fetch(`/api/describe_location?${params}`);
  return response;
}

export default function ChatPopUp({ coords, onClose }: ChatPopUpProps) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Conversation>({ turns: [] });

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!coords || !message.trim()) return;

    const userTurn: Turn = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setConversation((prev) => ({
      turns: [...prev.turns, userTurn],
    }));

    setMessage("");

    const response = await onMessageSend(coords, message);
    const data = await response.json();

    const assistantTurn: Turn = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: data.response.content[0].text,
    };

    console.log(data);
    console.log(assistantTurn);

    setConversation((prev) => ({
      turns: [...prev.turns, assistantTurn],
    }));
  }
  return (
    <div className="fixed right-4 top-4 z-50 w-80 rounded-lg border bg-white p-4 shadow-lg text-black">
      <header>Globe Chat</header>
      <div>Latitude: {coords?.lat.toFixed(4)}</div>
      <div>Longitude: {coords?.lng.toFixed(4)}</div>
      <ConversationView conversation={conversation} />
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask about this place..."
          className="min-w- flex-1 rounded border px-2 py-1"
        />

        <button type="submit" className="rounded bg-black px-3 py-1 text-white">
          Send
        </button>
      </form>
    </div>
  );
}
