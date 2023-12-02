"use client";

import { useChat, type Message, useCompletion } from "ai/react";

import { cn } from "@/lib/utils";
import { ChatList } from "@/components/voicechatting/chat-list";
import { ChatPanel } from "@/components/voicechatting/chat-panel";
import { EmptyScreen } from "@/components/voicechatting/empty-screen";
import { ChatScrollAnchor } from "@/components/voicechatting/chat-scroll-anchor";
import { useLocalStorage } from "@/lib/voicechatting/hooks/use-local-storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { CharacterAudioPlayer } from "@/components/voicechatting/character-audio-player";
import { Report } from "@/components/voicechatting/report";
import { EvaluationStage } from "@/lib/voicechatting/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Companion, Relationship } from "@prisma/client";
import { ImagePersonaLargeComponent } from "@/components/image/image-persona-large";
const IS_PREVIEW = process.env.VERCEL_ENV === "preview";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  companion: Companion;
  relationship: Relationship;
}

// async function evaluateConversation(messages: Message[]): Promise<string> {
//   const response = await fetch("/api/voicechatting/evaluation", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ messages }),
//   });

//   return (await response.json())["report"];
// }

export function Chat({
  id,
  initialMessages,
  companion,
  relationship,
  className,
}: ChatProps) {
  const router = useRouter();
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    "ai-token",
    null
  );
  const [playMessage, setPlayMessage] = useState<Message | null>(null);
  // const [evaluationStep, setEvaluationStep] =
  //   useState<EvaluationStage>("intro");

  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const [previewTokenInput, setPreviewTokenInput] = useState(
    previewToken ?? ""
  );

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      api: `/api/relationship/${relationship.id}/chats/voicechatting/`,
      initialMessages,
      id,
      body: {
        id,
        previewToken,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
      onFinish(message: Message) {
        setPlayMessage(message);
      },
    });

  // const { completion, complete } = useCompletion({
  //   api: "/api/voicechatting/evaluation",
  // });

  // useEffect(() => {
  //   if (messages.length > 0 && evaluationStep === "intro") {
  //     setEvaluationStep("conversation");
  //   }
  // }, [messages.length]);

  // const onEndChat = async () => {
  //   setEvaluationStep("report");
  //   complete("", { body: { messages } });
  // };

  // const restart = () => {
  //   setEvaluationStep("intro");
  //   router.refresh();
  //   router.push("/");
  // };

  return (
    <>
      {/* <div className="flex justify-center col-auto">
        <Link href={`/dashboard/companion/${companion.id}`}>
          <ImagePersonaLargeComponent companion={companion} />
        </Link>
      </div> */}
      <div className={cn("pb-[200px] pt-2 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
            <CharacterAudioPlayer playMessage={playMessage} />
            {/* {evaluationStep === "report" && <Report report={completion} />} */}
          </>
        ) : (
          <EmptyScreen companion={companion} />
          // <h1>Welcome!!</h1>
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        // onEndChat={onEndChat}
        // evaluationStep={evaluationStep}
        // restart={restart}
      />
    </>
  );
}
