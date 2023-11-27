//import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/prismadb";
//import {pinecone} from "@/lib/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbedding } from "@/lib/openai";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth, currentUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin/isAdmin";
const environment: string = process.env.PINECONE_ENVIRONMENT!;
const apiKey: string = process.env.PINECONE_API_KEY!;

const pinecone = new Pinecone({
  apiKey: apiKey,
  environment: environment,
});

// const companionPineConeIndex = "jimmy-clone-index";
// const pineconeIndex = pinecone.Index(companionPineConeIndex);

export async function POST(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const companion = await prisma.companion.findUnique({
      where: {
        id: params.companionId,
      },
    });
    if (!companion) {
      return Response.json({ error: "Error" }, { status: 401 });
    }

    const companionPineConeIndex = companion.namespace;
    const pineconeIndex = pinecone.Index(companionPineConeIndex);

    const body = await req.json();

    const parseResult = createNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });
      const ns1 = pineconeIndex.namespace("jimmyeaton");
      await ns1.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return note;
    });

    return Response.json({ note }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const body = await req.json();
    const companion = await prisma.companion.findUnique({
      where: {
        id: params.companionId,
      },
    });
    if (!companion) {
      return Response.json({ error: "Error" }, { status: 401 });
    }

    const companionPineConeIndex = companion.namespace;
    const pineconeIndex = pinecone.Index(companionPineConeIndex);
    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    // TODO also move code to admin for admin use. This is for user use
    let userIsAdmin = await isAdmin(userId);

    // if (!userId || userId !== note.userId  ) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }
    // if (!userId) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }
    const embedding = await getEmbeddingForNote(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      await pineconeIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return updatedNote;
    });

    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();

    // if (!userId || userId !== note.userId) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({ where: { id } });
      // await pineconeIndex.deleteOne(id);
    });

    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
