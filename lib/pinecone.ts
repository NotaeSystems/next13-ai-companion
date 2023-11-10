// /lib/context/pinecone.ts
// gets context from a pinecone index

import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

const environment: string = process.env.PINECONE_ENVIRONMENT!;
const apiKey: string = process.env.PINECONE_API_KEY!;

export async function pinecone() {
  try {
    // set api variables for pinecone vectorized documents and create new pinecode
    const pinecone = new Pinecone({
      apiKey: apiKey,
      environment: environment,
    });

    return pinecone;
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
