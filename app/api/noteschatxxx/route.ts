//import { notesIndex } from "@/lib/db/pinecone";
//import prisma from "@/lib/db/prisma";
import prisma from "@/lib/prismadb";
import { Pinecone } from "@pinecone-database/pinecone";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionMessage } from "openai/resources/index.mjs";

const environment: string = process.env.PINECONE_ENVIRONMENT!;
const apiKey: string = process.env.PINECONE_API_KEY!;

const pinecone = new Pinecone({
  apiKey: apiKey,
  environment: environment,
});
const pineconeIndexEnv: string = process.env.PINECONE_INDEX!;
//const companionPineConeIndex = "jimmy-clone-index";
const pineconeIndex = pinecone.Index(pineconeIndexEnv);

export async function POST(req: Request) {
  try {
    console.log("inside of POST /api/noteschat");

    const body = await req.json();

    const messages: ChatCompletionMessage[] = body.messages;

    // get the last 10 messages to determine what we are talking about
    const messagesTruncated = messages.slice(-10);

    // these messages need to be embedded and sent to the vector database
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n")
    );

    console.log("Embeddings: " + embedding);
    const { userId } = auth();

    // can we query by namespace?
    const namespace = pineconeIndex.namespace("jimmyeaton");
    const vectorQueryResponse = await namespace.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("Relevant notes found: ", relevantNotes);

    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content:
        "You are the ex-husband of the user. The user is your ex-wife You will answer the user's question based upon the following facts about you. " +
        "The relevant facts you know about the user are:\n" +
        "## Relevant Facts about User in first person" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
