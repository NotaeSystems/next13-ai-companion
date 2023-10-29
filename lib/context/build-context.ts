//import prismadb from "@/lib/prismadb";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Companion, User, Relationship } from "@prisma/client";
import { getPineConeRelevant } from "@/lib/context/pinecone";

export async function buildContext(
  companion: Companion,
  lastUserMessage: string
) {
  // this will build the system message or context to pass to the LLM
  console.log("inside of buildContext. lastUserMessage: " + lastUserMessage);
  let context = companion.instructions + "/n" + companion.seed;

  // lets check and see if there is a pineconeIndex pointing to a vectorized pinecone document

  // TODO
  if (companion.pineconeIndex) {
    console.log(
      "there is a pineconeIndex for Companion: " + companion.pineconeIndex
    );
    // const relevantDocs = await getPineConeRelevant(
    //   companion.pineconeIndex,
    //   lastUserMessage
    // );
    // console.log("Relevant Docs: " + JSON.stringify(relevantDocs));
    //TODO pass message to companion pinecone document
  } else {
    // pass message to pinecone
    console.log("there is not a pineconeIndex for Companion");
  }

  //lets see if there is a Relationship between User and Companion

  // TODO
  return context;
}
