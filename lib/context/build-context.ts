//import prismadb from "@/lib/prismadb";
//import { OpenAIEmbeddings } from "langchain/embeddings/openai";
//import { PineconeClient } from "@pinecone-database/pinecone";
//import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Companion, User, Relationship } from "@prisma/client";
import { getPineConeRelevant } from "@/lib/context/pinecone";
//import { cp } from "fs";

export async function buildContext(
  companion: Companion,
  lastUserMessage: string
) {
  // this will build the system message or context to pass to the LLM
  console.log("inside of buildContext. lastUserMessage: " + lastUserMessage);
 
   // lets check and see if there is a pineconeIndex pointing to a vectorized pinecone document

   let relevantDocs:any
  
  // check to see if there is a pineconeIndex document
  if (companion.pineconeIndex) {
    console.log(
      "there is a pineconeIndex for Companion: " + companion.pineconeIndex
    );
    relevantDocs = await getPineConeRelevant(
      companion.pineconeIndex,
      lastUserMessage
    );

    console.log("Relevant Docs: " + JSON.stringify(relevantDocs));
   
  } else {
    // pass message to pinecone
    console.log("there is not a pineconeIndex for Companion");
  }
  // generate the context to be sent to LLM as system message
  let context =
    `ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix.`
    + companion.instructions + "/n" 
    + companion.relationship
    + "Below are facts, if any,  about you. Treat these as facts"
    + companion.seed + "/n" 
    + JSON.stringify(relevantDocs);
    + "Below are relevant details about the conversation you are in."

  //console.log("the full context is: " + context)
  return context;
}
