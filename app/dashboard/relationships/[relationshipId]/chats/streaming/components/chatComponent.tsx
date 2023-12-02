"use client";
import { useChat, Message } from "ai/react";
import { Companion, Relationship } from "@prisma/client";
import { BeatLoader } from "react-spinners";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChatHeader } from "@/components/chat-header";
import { AudioPlayerComponent } from "./AudioPlayerComponent";
import { useEffect, useState } from "react";
import { UserAvatar } from "@/components/chat/user-avatar";
// Import the WhisperSTT class from the library
import { WhisperSTT } from "whisper-speech-to-text";

interface StreamingProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
  relationship: Relationship;
}

export default function ChatComponent({
  companion,
  relationship,
}: StreamingProps) {
  const [playMessage, setPlayMessage] = useState<Message | null>(null);
  const [playVoice, setPlayVoice] = useState(false);
  const [micStatus, setMicStatus] = useState(false);
  const [startRecording, setStartRecording] = useState(false);

  const { toast } = useToast();
  const { theme } = useTheme();

  // lets make message null so upon a useState there is no message for voice play
  let message: Message | null = null;

  // Vercel AI SDK (ai package) useChat()
  // useChat -> handles messages for us, user input, handling user submits, etc.

  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      // api: `/api/chats/${companion.id}/streaming/`,
      api: `/api/relationship/${relationship.id}/chats/streaming/`,
      onFinish(message) {
        setPlayMessage(message);
      },
    });

  // messages -> [user asks a question, ai response, user asks again, gpt-4 responds]

  //console.log(messages);
  //console.log(input);
  const voiceId: string = companion.voiceId;

  function turnOnVoiceHandler() {
    console.log("made it to turnOnVoiceHandler");
    setPlayMessage("");
    if (playVoice === true) {
      setPlayVoice(false);
    } else {
      setPlayVoice(true);
    }
  }

  function micStatusHandler() {
    console.log("made it to turnOnVoiceHandler");
    if (micStatus === true) {
      setMicStatus(false);
    } else {
      setMicStatus(true);
    }
  }
  function startRecordingHandler() {
    console.log("made it to startRecordingHandler");
    if (startRecording === false) {
      setStartRecording(true);
    } else {
      console.log("made it to startRecordingHandler. Start Recording is false");
      setStartRecording(false);
    }
  }

  function clearChatHandler() {
    console.log("made it to clearChatHandler");
    messages;
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      {/*  Need to params voiceId to StreamingAudioPlayer */}
      {playVoice ? (
        <AudioPlayerComponent playMessage={playMessage} voiceId={voiceId} />
      ) : (
        ""
      )}
      {/* <AudioPlayerComponent playMessage={playMessage} voiceId={voiceId} /> */}
      {messages.map((message: Message) => {
        return (
          <>
            <div key={message.id}>
              {/*  Name of person talking */}
              {/* {message.role === "assistant" ? (
                <h3 className="text-lg font-semibold mt-2">{companion.name}</h3>
              ) : (
                <h3 className="text-lg font-semibold mt-2 justify-end">You</h3>
              )} */}

              {/* Formatting the message */}
              {message.content
                .split("\n")
                .map((currentTextBlock: string, index: number) => {
                  if (currentTextBlock === "") {
                    return <p key={message.id + index}>&nbsp;</p>; // " "
                  } else {
                    if (message.role === "assistant") {
                      return (
                        <>
                          <p
                            key={message.id + index}
                            className="text-black bg-white"
                          >
                            {currentTextBlock}
                          </p>
                        </>
                      );
                    } else {
                      return (
                        <p
                          key={message.id + index}
                          className="group text-red-300 flex items-start gap-x-3 py-4 w-full justify-end"
                        >
                          {currentTextBlock}
                          {<UserAvatar />}
                        </p>
                      );
                    }
                  }
                })}
            </div>
          </>
        );
      })}

      <form className="mt-12" onSubmit={handleSubmit}>
        {isLoading ? (
          <BeatLoader color={theme === "light" ? "black" : "white"} size={5} />
        ) : (
          ""
        )}
        <p>Your Message</p>
        <input
          className="mt-2 w-full bg-slate-600 p-2"
          placeholder={`Converse with ${companion.name}`}
          value={input}
          onChange={handleInputChange}
        />
        <div>
          <Button className="rounded-md bg-blue-600 p-2 mt-2">
            Send message
          </Button>

          <Button className="rounded-md bg-red-400 p-2 mt-2">Clear Chat</Button>

          {micStatus ? (
            <Button
              onClick={micStatusHandler}
              className="rounded-md bg-green-400 p-2 mt-2"
            >
              Mic On
            </Button>
          ) : (
            <Button
              onClick={micStatusHandler}
              className="rounded-md bg-yellow-400 p-2 mt-2"
            >
              Mic Off
            </Button>
          )}

          {playVoice ? (
            <Button
              onClick={turnOnVoiceHandler}
              className="rounded-md bg-green-400 p-2 mt-2"
            >
              Speakers On
            </Button>
          ) : (
            <Button
              onClick={turnOnVoiceHandler}
              className="rounded-md bg-yellow-400 p-2 mt-2"
            >
              Speakers Off
            </Button>
          )}

          {startRecording ? (
            <Button
              onClick={startRecordingHandler}
              className="rounded-md bg-red-400 p-2 mt-2"
            >
              Stop Recording
            </Button>
          ) : (
            <Button
              onClick={startRecordingHandler}
              className="rounded-md bg-green-400 p-2 mt-2"
            >
              Start Recording
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
