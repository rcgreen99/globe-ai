"use client";

import type { GlobeCoords } from "@/components/Globe";
import { useEffect, useRef, useState } from "react";
import ConversationView from "./Chat/ConversationView";

const DEFAULT_PANEL_WIDTH = 384;
const MIN_PANEL_WIDTH = 320;
const MAX_PANEL_WIDTH_RATIO = 0.9;

export type Turn = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type Conversation = {
  turns: Turn[];
};

type ChatSidePanelProps = {
  conversation?: Conversation;
  coords?: GlobeCoords | null;
  isExpanded: boolean;
  onToggle: () => void;
};

async function onMessageSend(
  coords: GlobeCoords,
  userInput: string,
  conversation: Conversation,
) {
  const response = await fetch("/api/conversations/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      latitude: coords.lat,
      longitude: coords.lng,
      user_input: userInput,
      conversation,
    }),
  });

  return response;
}

export default function ChatSidePanel({
  coords,
  isExpanded,
  onToggle,
}: ChatSidePanelProps) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Conversation>({ turns: [] });
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isResizing) return;

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    function handlePointerMove(event: PointerEvent) {
      if (animationFrameRef.current !== null) return;

      animationFrameRef.current = window.requestAnimationFrame(() => {
        const maxPanelWidth = Math.floor(
          window.innerWidth * MAX_PANEL_WIDTH_RATIO,
        );
        const nextWidth = window.innerWidth - event.clientX;

        setPanelWidth(
          Math.min(Math.max(nextWidth, MIN_PANEL_WIDTH), maxPanelWidth),
        );
        animationFrameRef.current = null;
      });
    }

    function handlePointerUp() {
      setIsResizing(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isResizing]);

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!coords || !message.trim()) return;

    const userInput = message;
    const userTurn: Turn = {
      id: crypto.randomUUID(),
      role: "user",
      content: userInput,
    };
    const assistantTurn: Turn = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };
    const nextConversation = {
      turns: [...conversation.turns, userTurn],
    };

    setConversation((prev) => ({
      turns: [...prev.turns, userTurn, assistantTurn],
    }));

    setMessage("");

    const response = await onMessageSend(coords, userInput, nextConversation);

    if (!response.ok || !response.body) {
      setConversation((prev) => ({
        turns: prev.turns.map((turn) =>
          turn.id === assistantTurn.id
            ? { ...turn, content: "Sorry, something went wrong." }
            : turn,
        ),
      }));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      setConversation((prev) => ({
        turns: prev.turns.map((turn) =>
          turn.id === assistantTurn.id
            ? { ...turn, content: turn.content + chunk }
            : turn,
        ),
      }));
    }
  }

  return (
    <aside
      className={`relative z-10 flex h-screen shrink-0 flex-col overflow-hidden border-l border-neutral-800 bg-neutral-950 shadow-xl text-neutral-100 ${
        isResizing ? "" : "transition-[width,padding] duration-300 ease-in-out"
      } ${isExpanded ? "max-w-[90vw] p-4" : "w-14 p-2"}`}
      style={isExpanded ? { width: panelWidth } : undefined}
    >
      {isExpanded && (
        <div
          className="absolute inset-y-0 left-0 w-1 cursor-col-resize touch-none transition hover:bg-neutral-600"
          onPointerDown={() => setIsResizing(true)}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize chat panel"
        />
      )}
      <header
        className={`flex items-center ${
          isExpanded ? "justify-between" : "justify-center"
        }`}
      >
        <div
          className={`min-w-0 transition-opacity duration-150 ${
            isExpanded ? "opacity-100 delay-150" : "hidden opacity-0"
          }`}
        >
          <h2 className="truncate text-sm font-semibold text-neutral-100">
            Globe Chat
          </h2>
          <p className="truncate text-xs text-neutral-400">
            Ask about this location
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
          title={isExpanded ? "Collapse chat" : "Expand chat"}
        >
          {isExpanded ? "›" : "‹"}
        </button>
      </header>
      <div
        className={`flex min-h-0 flex-1 flex-col transition-opacity duration-150 ${
          isExpanded ? "opacity-100 delay-150" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-xs text-neutral-400">
          <div>Latitude: {coords?.lat.toFixed(4) ?? "--"}</div>
          <div>Longitude: {coords?.lng.toFixed(4) ?? "--"}</div>
        </div>
        <ConversationView conversation={conversation} />
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask about this place..."
            className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-700"
          />

          <button
            type="submit"
            className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
          >
            Send
          </button>
        </form>
      </div>
    </aside>
  );
}
