import type { Conversation } from "@/components/ChatPopUp";

type ConversationViewProps = {
  conversation: Conversation;
};

export default function ConversationView({
  conversation,
}: ConversationViewProps) {
  return (
    <div>
      {conversation.turns.map((turn) => (
        <div key={turn.id}>{turn.content}</div>
      ))}
    </div>
  );
}
