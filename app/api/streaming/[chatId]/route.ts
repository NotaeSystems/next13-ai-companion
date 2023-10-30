// /app/api/streaming/[chatID] route.ts Route Handlers
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { rateLimit } from "@/lib/rate-limit";
import { buildContext } from "@/lib/context/build-context";
import prismadb from "@/lib/prismadb";
// edge causes problems getting .env for production?
//export const runtime = 'edge'; // Provide optimal infrastructure for our API route (https://edge-runtime.vercel.app/)

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

dotenv.config({ path: `.env` });
// POST localhost:3000/api/chat
export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    console.log("inside of /api/streaming/[companion_id]");
    const { messages } = await request.json(); // { messages: [] }
    //const message = messages.at(-1);
    const message = messages[messages.length - 1];
    const lastUserMessage = message.content;

    console.log("last User Message: " + lastUserMessage);
    // messages [{ user and he says "hello there" }]
    //console.log(messages.last);
    console.log(params.chatId);

    // BOMBs out here if on edge****
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      console.log("Not a logged in user redirecting");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log(user.firstName);

    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier);

    if (!success) {
      console.log("Rate limit exceeded");
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const companion = await prismadb.companion.findUnique({
      where: {
        id: params.chatId,
      },
      // data: {
      //   messages: {
      //     create: {
      //       content: prompt,
      //       role: "user",
      //       userId: user.id,
      //     },
      //   },
      // }
    });

    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }

    // system message
    // system message tells LLM how to act
    // it should always be at the front of your array

    // createChatCompletion (get response from GPT-3.5)

    // buildContext builds the system message for the LLM
    console.log("Sending lastUserMessage to buildcontest: " + lastUserMessage);
    
    const systemMessage = await buildContext(companion, lastUserMessage);

    // console.log(systemMessage);

    //console.log("temperature: " + companion.temperature);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      temperature: companion.temperature,
      messages: [{ role: "system", content: systemMessage }, ...messages],
    });

    // create a stream of data from OpenAI (stream data to the frontend)
    const stream = await OpenAIStream(response);

    //console.log(response)
    // send the stream as a response to our client / frontend

    return new StreamingTextResponse(stream);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
