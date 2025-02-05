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
  console.log("inside of chat.txs : " + companion.name);

  const router = useRouter();
  // const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
  //   "ai-token",
  //   null
  // );
  // sets message to be played by speakers
  const [playMessage, setPlayMessage] = useState<Message | null>(null);

  // whether or not to use speakers to play Assistant's response message
  const [playVoice, setPlayVoice] = useState(false);

  // const [evaluationStep, setEvaluationStep] =
  //   useState<EvaluationStage>("intro");

  // const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  // const [previewTokenInput, setPreviewTokenInput] = useState(
  //   previewToken ?? ""
  // );

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      api: `/api/relationship/${relationship.id}/chats/voicechatting/`,
      initialMessages,
      id,
      body: {
        id,
        // previewToken,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
      // the message returned is the assistant's response
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
  let allowVoice: boolean = false;
  if (
    companion.adminAllowVoice === "Active" &&
    relationship.adminAllowVoice === "Active"
  ) {
    allowVoice = true;
  }

  const voiceId: string = companion.voiceId;

  function turnOnVoiceHandler() {
    console.log("made it to turnOnVoiceHandler");
    setPlayMessage(null);
    if (playVoice === true) {
      setPlayVoice(false);
    } else {
      setPlayVoice(true);
    }
  }
  console.log("playvoice=" + playVoice);

  return (
    <>
      {allowVoice ? (
        <h1>
          {playVoice ? (
            <Button
              onClick={turnOnVoiceHandler}
              className="rounded-md bg-green-400 p-2 mt-2"
            >
              Turn Speakers Off
            </Button>
          ) : (
            <Button
              onClick={turnOnVoiceHandler}
              className="rounded-md bg-yellow-400 p-2 mt-2"
            >
              Turn Speakers On
            </Button>
          )}
        </h1>
      ) : null}
      {/* <div className="flex justify-center col-auto">
        <Link href={`/dashboard/companion/${companion.id}`}>
          <ImagePersonaLargeComponent companion={companion} />
        </Link>
      </div> */}
      <div className={cn("pb-[200px] pt-2 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} companion={companion} />
            <ChatScrollAnchor trackVisibility={isLoading} />
            {playVoice ? (
              <CharacterAudioPlayer
                playMessage={playMessage}
                voiceId={voiceId}
              />
            ) : null}
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
