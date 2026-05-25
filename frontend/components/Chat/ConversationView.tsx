import type { Conversation, Turn } from "@/components/ChatSidePanel";
import Markdown from "react-markdown";

type ConversationViewProps = {
  conversation: Conversation;
};

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 last:mb-0">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a
      href={href}
      className="underline decoration-neutral-400 underline-offset-2 hover:text-white"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
};

function TurnView({ turn }: { turn: Turn }) {
  const isUser = turn.role === "user";
  const bubbleClassName = isUser
    ? "max-w-[85%] rounded-lg bg-neutral-700 p-2 text-neutral-100 shadow-sm"
    : "max-w-[85%] rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-100 shadow-sm";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={bubbleClassName}>
        <Markdown components={markdownComponents}>{turn.content}</Markdown>
      </div>
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
