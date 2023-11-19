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
import { auth } from "@clerk/nextjs";

const environment: string = process.env.PINECONE_ENVIRONMENT!;
const apiKey: string = process.env.PINECONE_API_KEY!;
const pineconeIndexEnv: string = process.env.PINECONE_INDEX!;
const pinecone = new Pinecone({
  apiKey: apiKey,
  environment: environment,
});

// const companionPineConeIndex = "jimmy-clone-index";
// const pineconeIndex = pinecone.Index(companionPineConeIndex);

export async function POST(
  req: Request,
  { params }: { params: { companionId: string; role: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    console.log("req url: " + req.url);
    const role = searchParams.get("role");
    console.log("role= " + role);
    console.log("inside of POST /api/notes/[companionId]?role=" + role);
    const companion = await prisma.companion.findUnique({
      where: {
        id: params.companionId,
      },
    });
    if (!companion) {
      return Response.json({ error: "Error" }, { status: 401 });
    }

    //const companionPineConeIndex = companion.pineconeIndex;
    const companionPineConeIndex = pineconeIndexEnv;
    console.log("pineconeIndex: " + companionPineConeIndex);

    if (!companionPineConeIndex) {
      return Response.json({ error: "Error" }, { status: 401 });
    }

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
    let setUserId: string | null;
    const embedding = await getEmbeddingForNote(title, content);
    if (role === "assistant") {
      setUserId = null;
    } else {
      setUserId = userId;
    }
    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content: content,
          userId: setUserId,
          companionId: companion.id,
        },
      });
      const ns1 = pineconeIndex.namespace(companion.namespace);
      if (!content) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      await ns1.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId, content: title + ": " + content },
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
    console.log("made it to PUT /api/notes/[companionId]");
    const body = await req.json();
    const companion = await prisma.companion.findUnique({
      where: {
        id: params.companionId,
      },
    });
    if (!companion) {
      return Response.json({ error: "Error" }, { status: 401 });
    }

    const companionPineConeIndex = pineconeIndexEnv;
    if (!companionPineConeIndex) {
      return Response.json({ error: "Error" }, { status: 401 });
    }

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

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    console.log("embeddings: " + embedding);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });
      const pineconeIndex = pinecone.Index(pineconeIndexEnv);
      const namespace = pineconeIndex.namespace(companion.namespace);
      // TODO remove metadata: { userId: userId } if companion is inserting his own notes
      await namespace.upsert([
        {
          id,
          values: embedding,
          metadata: { userId: userId, content: title + ": " + content },
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

export async function DELETE(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    console.log("inside of DELETE /api/admin/notes/[companionId]");
    const body = await req.json();
    const companion = await prisma.companion.findUnique({
      where: {
        id: params.companionId,
      },
    });
    if (!companion) {
      return Response.json({ error: "Error" }, { status: 401 });
    }

    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;
    console.log("delete id: " + id);
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
    const pineconeIndex = pinecone.Index(pineconeIndexEnv);
    const namespace = pineconeIndex.namespace(companion.namespace);
    await prisma.$transaction(async (tx) => {
      await tx.note.delete({ where: { id } });
      await namespace.deleteOne(id);
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
