// /lib/context/pinecone.ts
// gets context from a pinecone index

import { Pinecone } from "@pinecone-database/pinecone";
//import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
//import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextResponse } from "next/server";
//const embedder = new OpenAIEmbeddings();

//const pineconeStore = new PineconeStore(embedder, { pineconeIndex: index, namespace: 'langchain' });

const environment: string = process.env.PINECONE_ENVIRONMENT!;
const apiKey: string = process.env.PINECONE_API_KEY!;
let relevantDocs:any
// this function is passed the pinecodeIndex name belonging to companion
// it is also passed the last chat message sent by user
// TODO should the past few messages be passed for more context to the conversation?

export async function getPineConeRelevant(index: string, message: string) {
  try {
  // set api variables for pinecone vectorized documents and create new pinecode 
  const pinecone = new Pinecone({
    apiKey: apiKey,
    environment: environment,
  });

  // Instantiate a new Pinecone client, which will automatically read the
  // env vars: PINECONE_API_KEY and PINECONE_ENVIRONMENT which come from
  // the Pinecone dashboard at https://app.pinecone.io
  
  // assign the index name of the document at Pinecone belonging to assistant from companion record and passed to this function
  const pineconeIndex = pinecone.Index(index);

  // set the vectorStore with the pinecodeIndex to the 
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  /* Call the api and Search the vector DB independently with meta filters */
  const results = await vectorStore.similaritySearch(message, 1, {
    //foo: "bar",
  });

  relevantDocs = results.map((doc) => doc.pageContent).join("\n");
  //console.log(results);

  return relevantDocs;
} catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
}
}

