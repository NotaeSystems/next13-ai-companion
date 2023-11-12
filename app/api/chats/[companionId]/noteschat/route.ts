//import { notesIndex } from "@/lib/db/pinecone";
//import prisma from "@/lib/db/prisma";
import prisma from "@/lib/prismadb";
import { Pinecone } from "@pinecone-database/pinecone";
import openai, { getEmbedding } from "@/lib/openai";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { NextResponse } from "next/server";
import { Companion, User, Relationship } from "@prisma/client";
import { findRelationship } from "@/lib/context/findRelationship";
import { auth, currentUser } from "@clerk/nextjs";

const environment: string = process.env.PINECONE_ENVIRONMENT!;
const apiKey: string = process.env.PINECONE_API_KEY!;

const pinecone = new Pinecone({
  apiKey: apiKey,
  environment: environment,
});
const pineconeIndexEnv: string = process.env.PINECONE_INDEX!;
//const companionPineConeIndex = "jimmy-clone-index";
const pineconeIndex = pinecone.Index(pineconeIndexEnv);

export async function POST(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    console.log("inside of POST /api/chats/[companionId/noteschat");

    const body = await request.json();

    ///// find the is the user who is logged in///////////////////
    const { userId } = auth();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      console.log("Not a logged in user redirecting");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    ///////////////////////////////////////////////////////////

    // find the companion user is chatting with //////////////////////
    const companion = await prisma.companion.findUnique({
      where: {
        id: params.companionId,
      },
    });

    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }

    ///// Relationship: lets find out how the User is related to the Companion
    let relationship: Relationship;
    relationship = await findRelationship(user.id, companion);
    //console.log("Relationship content: " + relationship.content)

    // lets check to see if the conversations limit has been reached for billing purposes
    if (relationship.conversations > relationship.conversationsLimit) {
      console.log(
        "conversational Limit of " +
          relationship.conversationsLimit +
          " reached"
      );
    }

    ///////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////

    ///// Memory: the present chat messages are sent by the chat page ///////////////////////////////
    const messages: ChatCompletionMessage[] = body.messages;

    // Memory: get the last 10 messages from present chat to determine what we have been talking about
    const messagesTruncated = messages.slice(-10);

    // these messages need to be embedded by openai and sent to the Pinecone vector database
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n")
    );
    ///////////////////////////////////////////////////////////////////

    //// namespace is the location of our companion's part of the Pincone Vectorized Database
    //  where facts about this companion is stored
    const namespace = pineconeIndex.namespace(companion.namespace);

    ///// lets query Pinecone namespace with our last few messages that were embedded by openai
    // and find  relevant facts that were inserted by the present User
    const vectorAssistantQueryResponse = await namespace.query({
      vector: embedding,
      topK: 6,
      filter: { userId: undefined },
      includeMetadata: true,
      includeValues: false,
    });

    console.log(
      "vectorAssistantrQueryResponse: " +
        JSON.stringify(vectorAssistantQueryResponse)
    );

    console.log(
      vectorAssistantQueryResponse.matches?.map((match) => ({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        text: match.metadata?.text,
        score: match.score,
      }))
    );

    //// now that we have received some relevant vectorized data back from Pinecone
    // lets find the user notes in mongodb that were used to make the vectorized data
    const assistantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorAssistantQueryResponse.matches.map((match) => match.id),
        },
        userId: userId,
      },
    });

    const relevantAssistantNotes = assistantNotes
      .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
      .join("\n\n");

    console.log("Relevant Assistant notes found: ", relevantAssistantNotes);

    ///// lets query Pinecone namespace with our last few messages that were embedded by openai
    // and find  relevant facts that were inserted by the present User
    const vectorUserQueryResponse = await namespace.query({
      vector: embedding,
      topK: 6,
      filter: { userId: userId },
      includeMetadata: true,
      includeValues: false,
    });

    console.log(
      "vectorUserQueryResponse: " + JSON.stringify(vectorUserQueryResponse)
    );

    console.log(
      vectorUserQueryResponse.matches?.map((match) => ({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        text: match.metadata?.text,
        score: match.score,
      }))
    );

    //// now that we have received some relevant vectorized data back from Pinecone
    // lets find the user notes in mongodb that were used to make the vectorized data
    const userNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorUserQueryResponse.matches.map((match) => match.id),
        },
        userId: userId,
      },
    });

    const relevantUserNotes = userNotes
      .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
      .join("\n\n");

    //console.log("Relevant Assistant notes found: ", relevantUserNotes);

    /// find notes regarding assistant. UserId will be null for notes generated by the companion
    // const assistantNotes = await prisma.note.findMany({
    //   where: {
    //     id: {
    //       in: vectorQueryResponse.matches.map((match) => match.id),
    //     },
    //     userId: null,
    //   },
    // });
    // const relevantAssistantNotes = assistantNotes
    //   .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
    //   .join("\n\n");

    // console.log("Relevant Assistant notes found: ", relevantAssistantNotes);

    ///////////////////////////////////////////////////////////////////////////

    //// lets pull the relationship information between User and Assistant
    const userRelationship = relationship.content;
    //console.log("User Relationship: " + userRelationship);
    ////

    const assistantRole = companion.description;

    const context =
      `ONLY generate sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. \n` +
      "## Relevant Facts about yourself in third person" +
      assistantRole +
      "End of Relevant Facts about yourself in third person" +
      "\n" +
      "## Relevant Facts about yourself in first person \n" +
      relevantAssistantNotes +
      "## End of Relevant Facts about yourself first person \n" +
      userRelationship +
      "\n" +
      "## Relevant Facts about User in first person \n" +
      relevantUserNotes +
      "\n";

    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content: context,
    };

    console.log("\n\n" + JSON.stringify(systemMessage) + "\n\n");

    // lets call the LLMand send the systemMessage along with messages now in the chat stream
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
      temperature: relationship.temperature,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
