import type { Conversation, Turn } from "@/components/ChatSidePanel";
import Markdown from "react-markdown";

type ConversationViewProps = {
  conversation: Conversation;
};

function TurnView({ turn }: { turn: Turn }) {
  const isUser = turn.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {isUser ? (
        <div className="max-w-[85%] rounded-lg bg-neutral-700 p-2 text-neutral-100 shadow-sm">
          <Markdown>{turn.content}</Markdown>
        </div>
      ) : (
        <div className="max-w-[85%] rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-100 shadow-sm">
          <Markdown>{turn.content}</Markdown>
        </div>
      )}
    </div>
  );
}

export default function ConversationView({
  conversation,
}: ConversationViewProps) {
  return (
    <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
      {conversation.turns.map((turn) => (
        <TurnView key={turn.id} turn={turn} />
      ))}
    </div>
  );
}
