import { type Message } from "ai";

import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "@/components/voicechatting/chat-message";
import { Companion, Relationship } from "@prisma/client";

export interface ChatList {
  messages: Message[];
  companion: Companion;
}

export function ChatList({ messages, companion }: ChatList) {
  if (!messages.length) {
    return null;
  }

  console.log("in chatlist:" + JSON.stringify(messages));
  return (
    <>
      <div className="relative mx-auto max-w-2xl px-4">
        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage message={message} companion={companion} />
            {index < messages.length - 1 && (
              <Separator className="my-4 md:my-8" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
