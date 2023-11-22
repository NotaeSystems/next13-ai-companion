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

//////////////////////////* Setup /////////////////////////////////////

//////////////////////////* Constants* /////////////////////////////

// number of chat messages to truncate from the end of req.body to get gist  of
// of the active chat for short-term transitive memory. These messages Will be passed to pinecone
const messagesTruncatedNumber = -10;

// turn on Debugging
const Debugging = true;

// the Openai LLM Model to use.
// TODO will be set in Companion record later
const llmModel = "gpt-3.5-turbo";

// Pinecone. The number of relevant vectorized facts to return from Pinecone vectorized search
const topK = 6;

///////////////////////// *Pinecone //////////////////////////////////////
// Pinecone is our vectorized database api service from which we get specialized vectorized knowledge
// pinecone apiKey and environment are keys needed to verify our account with Pinecone
// this information is obtained from our sites environment
// See: website: pinecone.io

const pineconeEnvironment: string = process.env.PINECONE_ENVIRONMENT!;
const pineconeApiKey: string = process.env.PINECONE_API_KEY!;

const pinecone = new Pinecone({
  apiKey: pineconeApiKey,
  environment: pineconeEnvironment,
});
// the pinecone function is now ready to send  requests to Pinecone

// Pinecone index is the name of pinecone's database where all our vectorized data is stored at Pinecone
// all our site's  vectorized data is stored in this index
const pineconeIndexEnv: string = process.env.PINECONE_INDEX!;

// we now use these variables to set up the pineCone index so we can make search requests
const pineconeIndex = pinecone.Index(pineconeIndexEnv);

/// we will still need some additional information to make requests to Pinecone which we
// will get once we know the companion and user who are chatting
/////////////////////////////////////////////

export async function POST(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    if (Debugging) {
      console.warn(
        "\n\n********************** New Conversation *****************************\n\n"
      );
    }

    if (Debugging) {
      console.log(
        "***** inside of POST /api/chats/[companionId]/streaming *****\n"
      );
    }

    console.log("***** Getting ready to verify User ********* \n");
    ///////////////////// *Verify User* /////////////////////////////////////
    ///// verify the user with Clerk who is logged in and making this call ///////////////////

    const { userId } = auth();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      console.log(" !!!!!!! Not a logged in user. Returning\n !!!!!!!!!!");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    ///////////////////////////////////////////////////////////

    console.log(
      "****** User verified: " +
        user.firstName +
        " " +
        user.lastName +
        "\n *********"
    );

    //////////////////////// *Verify  Companion* /////////////////////////////////
    // find the Companion that User is chatting with this is in the url as [companionId] //////////////////////
    // the information comes to as params in the url and is inthe params variable

    console.log("****** Getting ready to find Companion\n  *********");
    let companion: Companion | null;

    companion = await prisma.companion.findUnique({
      where: {
        id: params.companionId,
      },
    });

    // if we cannot find companion Or companion is 'Suspended' then we will return an error
    if (!companion) {
      console.log(
        "\n !!!!!!!!!!!!!Could not find an active Companion. Returning. !!!!!!!!! \n"
      );
      return new NextResponse("Companion not found", { status: 404 });
    }
    // we found the Companion now check to see if Companion is active

    if (companion.status != "Active") {
      console.log(
        " *********  Companion found but is not active. Companion Status: " +
          companion.status +
          "****************\n"
      );
      return new NextResponse(
        " !!!!!!!!!! Companion found but is not active. Returning  !!!!!!!!!!!!!!!!!!!\n",
        {
          status: 404,
        }
      );
    }

    console.log(
      " ****** Found an active Companion: " + companion.name + "***********\n"
    );

    ////////////////////////  *Verify  Relationship* //////////////////////////////////////
    // now that we have a valid character and a valid user lets see what is their relationship

    ///// Relationship: lets find out how the User is related to the Companion and sets the tone of the conversation
    /// lets run our function from "@/lib/context/findRelationship";
    /// the Relationship record between User and Companion is created when user subwscribes to Companion

    console.log(
      "\n\n *************** Finding Relationship between User and Companion ************** \n\n"
    );

    let relationship: Relationship | null;
    relationship = await findRelationship(user.id, companion);

    //console.log("Relationship content: " + relationship.content)

    // User must have an active relationship to chat with a companion
    if (!relationship) {
      console.log(
        "\n\n !!!!!!!!!!!!!!! Did not find a Relationship. Returning Unauthorized !!!!!!!!!!!!!!"
      );
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (relationship.status != "Active") {
      console.log(
        "\n\n !!!!!!!!!!!!!!!!!!! Found Relationship but Relationship is not Active. Returning Unauthorized !!!!!!!!!"
      );
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //////////////////////////  *Billing  /////////////////////////////////////////////////
    // lets check to see if the conversations limit has been reached by User for billing purposes
    // TODO do some billing here

    console.log("\n ****** Billing for Conversation Limit ********\n");
    console.log(
      "\n Relationship Conversations: " + relationship.conversations + "\n"
    );
    console.log(
      "\n Relationship Conversations Limit: " +
        relationship.conversationsLimit +
        "\n"
    );

    if (relationship.conversations > relationship.conversationsLimit) {
      console.log(
        " !!!!!!!!!!!!!!!!!conversational Limit of " +
          relationship.conversationsLimit +
          " reached. Need to do Billing !!!!!!!!!!!"
      );
    }

    console.log(
      "\n************* Found Relationship. Getting Relationship Content ********************* \n"
    );

    const userRelationshipContent = relationship.content;

    /// now that the User , Companion and Relationship has been verified lets pull the request body for the chat
    // the request body has the present active chat messages

    /////////////////// * Active Chat*  /////////////////////////////
    /// the active chat is being passed to this function in the body of the request
    const body = await request.json();

    // console.log(
    //   "Request Body sent by chat page: " + "\n" + JSON.stringify(body) + "/n"
    // );

    // lets check if the User and Assistant has an active chat session already going on.

    ////////////////////// *Short-term Chat Memory  ///////////////////////////////////////
    console.log("\n *** Short Term Chat Memory ***\n");

    // the present chat messages are sent by the chat page.
    // the messages are give a special type of ChatCompletionMessage[]
    const messages: ChatCompletionMessage[] = body.messages;

    // Lets find the present chat message which is the last message in the array of messages
    const lastChatMessage = messages.slice(-1);

    console.log(
      "\n *************** Request Messages from present Active Chat: request.messages **************\n" +
        JSON.stringify(body.messages)
    );

    console.log("Last Chat Message: " + JSON.stringify(lastChatMessage));

    // It could be a long chat session that would be too much to send to the LLM
    // so we limit the the message history
    // Lets get the last number messages from present active chat to determine what we have been chatting about
    // messagesTruncatedNumber is set in Constants above

    const messagesTruncated = messages.slice(messagesTruncatedNumber);

    console.log(
      "\n Truncated Messages .The last: " +
        messagesTruncatedNumber +
        " from the Active Chat" +
        "\n" +
        JSON.stringify(messagesTruncated) +
        "\n"
    );

    // ********************* Embedding /Vectorizing Active Chat *********************
    // these messages need to be embedded and vectorized by openai and sent to the Pinecone vector database
    // we are using our getEmbedding function from our function "@/lib/openai

    console.log(
      "############### Embedding the truncated messages for querying Pinecone vectorized database ########"
    );
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n")
    );
    ///////////////////////////////////////////////////////////////////

    //// companionNamespace is the location of our companion's segmented partiton of the Pinecone Vectorized Database
    //  where public facts about this particular companion is stored

    console.log(
      "*************** Will be searching Pinecone in the Companion's namespace: " +
        JSON.stringify(companion.namespace) +
        "****************"
    );
    const companionNamespace = pineconeIndex.namespace(companion.namespace);

    ///// lets query Pinecone companion namespace with our last few messages that were embedded by openai
    // and find  relevant facts that were inserted by the present User. topK is the number of related records to return

    console.log(
      "********** Lets find Pine Cone data for Assistant **************"
    );

    const vectorAssistantQueryResponse = await companionNamespace.query({
      vector: embedding,
      topK: topK,
      filter: { userId: undefined },
      includeMetadata: true,
      includeValues: true,
    });
    console.log(
      vectorAssistantQueryResponse.matches?.map((match) => ({
        content: match.metadata?.content,
        score: match.score,
      }))
    );

    /// TODO figure out how to just get content
    const relevantAssistantMatches = JSON.stringify(
      vectorAssistantQueryResponse.matches?.map((match) => ({
        content: match.metadata?.content,
      }))
    );

    // // Debugging
    // console.log(
    //   "vectorAssistantrQueryResponse: " +
    //     JSON.stringify(
    //       "\n vectorAssistantQueryResponse" +
    //         vectorAssistantQueryResponse +
    //         "\n"
    //     )
    // );

    // console.log(
    //   vectorAssistantQueryResponse.matches?.map((match) => ({
    //     content: match.metadata?.content,
    //     score: match.score,
    //   }))
    // );

    //// now that we have received some relevant vectorized data back from Pinecone
    // lets find the user notes in mongodb that were used to make the vectorized data
    // !!!! not needed if we get content from the vectorAssistantQuery
    // const assistantNotes = await prisma.note.findMany({
    //   where: {
    //     id: {
    //       in: vectorAssistantQueryResponse.matches.map((match) => match.id),
    //     },
    //   },
    // });

    // const relevantAssistantNotes = assistantNotes
    //   .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
    //   .join("\n\n");

    // console.log("Relevant Assistant notes found: ", relevantAssistantNotes);

    ///// lets query Pinecone namespace with our last few messages that were embedded by openai
    // and find  relevant facts that were inserted by the present User
    console.log("********** Lets find Pine Cone data for User **************");
    const vectorUserQueryResponse = await companionNamespace.query({
      vector: embedding,
      topK: 6,
      filter: { userId: userId },
      includeMetadata: true,
      includeValues: false,
    });

    console.log(
      vectorUserQueryResponse.matches?.map((match) => ({
        content: match.metadata?.content,
        score: match.score,
      }))
    );
    // console.log(
    //   "vectorUserQueryResponse: " + JSON.stringify(vectorUserQueryResponse)
    // );

    // console.log(
    //   vectorUserQueryResponse.matches?.map((match) => ({
    //     userId: match.metadata?.userId,
    //     score: match.score,
    //     content: match.metadata?.content,
    //     relationship: match.metadata?.relationship,
    //   }))
    // );

    //// now that we have received some relevant vectorized data back from Pinecone
    // lets find the user notes in mongodb that were used to make the vectorized data
    const relevantUserMatches = JSON.stringify(
      vectorAssistantQueryResponse.matches?.map((match) => ({
        content: match.metadata?.content,
      }))
    );

    // console.log("Pinecone Relevant User Matches: " + relevantUserMatches);

    // const userNotes = await prisma.note.findMany({
    //   where: {
    //     id: {
    //       in: vectorUserQueryResponse.matches.map((match) => match.id),
    //     },
    //     userId: userId,
    //   },
    // });

    // const relevantUserNotes = userNotes
    //   .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
    //   .join("\n\n");

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

    //console.log("User Relationship: " + userRelationshipContent );
    ////

    const assistantRole = companion.role;

    /////////////////////////  *Context //////////////////////////////////////
    // lets build the context to send to the LLLM

    const context =
      `ONLY generate sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. Do not say your are an AI Assistant. Say you are a Persona\n` +
      "## Your role: ##" +
      assistantRole +
      "## End of Relevant Facts about yourself in third person ##" +
      "\n" +
      "## Relevant Facts about you ##" +
      relevantAssistantMatches +
      "## End of Relevant Facts about yourself first person ##" +
      userRelationshipContent +
      "\n" +
      "## Relevant Facts about User. User's name is " +
      relevantUserMatches +
      "\n";

    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content: context,
    };

    console.log(
      "\n\n System Message:\n " + JSON.stringify(systemMessage) + "\n\n"
    );

    // lets call the LLM model and send the systemMessage along with messages now in the chat stream
    // which includes the last message from User
    console.log(
      "\n Calling the LLM Model: " +
        llmModel +
        " with the System Message\n  Temperature is: " +
        relationship.temperature
    );

    const response = await openai.chat.completions.create({
      model: llmModel,
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
      temperature: relationship.temperature,
    });
    console.log("LLM response: " + JSON.stringify(response));
    console.log(
      "**********************End of Conversation*****************************"
    );

    //const stream = OpenAIStream(response);
    console.log("streaming response from LLM back to chat page");

    const stream = OpenAIStream(response, {
      // log tokens to the console
      onToken: (token) => console.log(token),
    });

    // console.log("Streaming LLM response: " + JSON.stringify(stream));
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
