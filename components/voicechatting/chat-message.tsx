"use client";

import { BeatLoader } from "react-spinners";
import { Copy } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { BotAvatar } from "@/components/bot-avatar";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { type Message } from "ai";
import { Companion, Relationship } from "@prisma/client";

export interface ChatMessageProps {
  // role: "system" | "user";
  message: Message;
  companion: Companion;
  // isLoading?: boolean;
  // src?: string;
  // id?: string;
}
const isLoading: boolean = false;
export function ChatMessage({ message, companion }: ChatMessageProps) {
  // console.log("inside of chat-message: " + companion.name);
  const { toast } = useToast();
  const { theme } = useTheme();

  const onCopy = () => {
    if (!message.content) {
      return;
    }

    navigator.clipboard.writeText(message.content);
    toast({
      description: "Message copied to clipboard.",
      duration: 3000,
    });
  };
  console.log("in chat-message; " + message.content);
  return (
    <>
      <div
        className={cn(
          "group flex items-start gap-x-3 py-4 w-full",
          message.role === "user" && "justify-end"
        )}
      >
        {message.role !== "user" && companion.src && (
          <BotAvatar src={companion.src} />
        )}
        <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
          {isLoading ? (
            <BeatLoader
              color={theme === "light" ? "black" : "white"}
              size={5}
            />
          ) : (
            message.content
          )}
        </div>
        {message.role === "user" && <UserAvatar />}
        {message.role !== "user" && !isLoading && (
          <Button
            onClick={onCopy}
            className="opacity-0 group-hover:opacity-100 transition"
            size="icon"
            variant="ghost"
          >
            <Copy className="w-4 h-4" />
          </Button>
        )}
      </div>
    </>
  );
}
