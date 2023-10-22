"use client"
import { useChat, Message } from "ai/react"
import { Companion } from "@prisma/client";
import { ChatHeader } from "@/components/chat-header";

interface StreamingProps {
    companion: Companion & {
      messages: Message[];
      _count: {
        messages: number;
      }
    };
  };


export default function ChatComponent({
    companion,
  }: StreamingProps) {
    // Vercel AI SDK (ai package) useChat()
    // useChat -> handles messages for us, user input, handling user submits, etc.
    const { input, handleInputChange, handleSubmit, isLoading, messages } = useChat(
            {api: `/api/streaming/${companion.id}`}
          );
    // messages -> [user asks a question, ai response, user asks again, gpt-4 responds]

    console.log(messages);
    console.log(input);

    return (
        <div>
            {messages.map((message : Message) => {
                return (
                    
                    <div key={message.id}>
                        
                        {/*  Name of person talking */}
                        {
                            message.role === "assistant"
                            ?
                            <h3 className="text-lg font-semibold mt-2">
                                {companion.name}
                            </h3>
                            :
                            <h3 className="text-lg font-semibold mt-2 justify-end">
                                You
                            </h3>
                        }
                        
                        {/* Formatting the message */}
                        {message.content.split("\n").map((currentTextBlock: string, index : number) => {
                            if(currentTextBlock === "") {
                                return <p key={message.id + index}>&nbsp;</p> // " "
                            } else {
                                if (message.role === "assistant"){
                                    return <p key={message.id + index} className="text-black bg-white">{currentTextBlock}</p> 
                                }else{
                                    return <p key={message.id + index} className="text-white bg-black justify-end" >{currentTextBlock}</p>
                                }
                            }
                        })}


                    </div>
                )
            })}
            

            <form className="mt-12" onSubmit={handleSubmit}>
                <p>Your Message</p>
                <textarea
                    className="mt-2 w-full bg-slate-600 p-2"
                    placeholder={`Converse with ${companion.name}`}
                    value={input}
                    onChange={handleInputChange}
                />
                <button className="rounded-md bg-blue-600 p-2 mt-2">
                    Send message
                </button>
            </form>
        </div>
    )
}