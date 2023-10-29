// /lib/context/pinecone.ts
// gets context from a pinecone index

import { Pinecone } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
const embedder = new OpenAIEmbeddings();
//const pineconeStore = new PineconeStore(embedder, { pineconeIndex: index, namespace: 'langchain' });

const environment: string = process.env.PINECONE_ENVIRONMENT!;
const apiKey: string = process.env.PINECONE_API_KEY!;

export async function getPineConeIndex(index: string, message: string) {
  const pinecone = new Pinecone({
    apiKey: apiKey,
    environment: environment,
  });

  // Instantiate a new Pinecone client, which will automatically read the
  // env vars: PINECONE_API_KEY and PINECONE_ENVIRONMENT which come from
  // the Pinecone dashboard at https://app.pinecone.io
  //const pinecone = new Pinecone();

  const pineconeIndex = pinecone.Index(index);

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  /* Search the vector DB independently with meta filters */
  const results = await vectorStore.similaritySearch(message, 1, {
    foo: "bar",
  });
  console.log(results);

  return results;
}
