//import prismadb from "@/lib/prismadb";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Companion, User, Relationship } from "@prisma/client";

export function buildContext(companion: Companion) {
  // this will build the system message or context to pass to the LLM

  let context = companion.instructions + "/n" + companion.seed;

  // lets check and see if there is a pineconeIndex pointing to a vectorized pinecone document

  // TODO
  if (companion.pineconeIndex) {
    console.log(
      "there is a pineconeIndex for Companion: " + companion.pineconeIndex
    );

    //TODO pass message to companion pinecone document
  } else {
    // pass message to pinecone
    console.log("there is not a pineconeIndex for Companion");
  }

  //lets see if there is a Relationship between User and Companion

  // TODO
  return context;
}
