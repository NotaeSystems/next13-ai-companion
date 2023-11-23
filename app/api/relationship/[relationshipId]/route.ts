import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function PATCH(
  req: Request,
  { params }: { params: { relationshipId: string } }
) {
  try {
    console.log("inside of /api/relationship/[relationshipId]");
    const body = await req.json();
    const user = await currentUser();
    const {
      status,
      role,
      name,
      nickNames,
      gender,
      educationalLevel,
      ageLevel,

      content,
      // temperature,

      // pineconeIndex,
    } = body;

    //console.log("relationship: " + relationship);

    if (!params.relationshipId) {
      return new NextResponse("Relationship ID required", { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if (!status) {
    //   console.log("missing fields");
    //   return new NextResponse("Missing required fields", { status: 400 });
    // }

    const isPro = await checkSubscription();

    if (!isPro) {
      return new NextResponse("Pro subscription required", { status: 403 });
    }

    let relationship = null;
    relationship = await prismadb.relationship.update({
      where: {
        id: params.relationshipId,
      },
      data: {
        status,
        content,
        role,
        name,
        nickNames,
        gender,
        educationalLevel,
        ageLevel,

        // instructions,
        // pineconeIndex,
        // temperature: Number(temperature),
      },
    });
    console.log(relationship);
    return NextResponse.json(relationship);
  } catch (error) {
    // console.log("[COMPANION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const companion = await prismadb.companion.delete({
      where: {
        userId,
        id: params.companionId,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
