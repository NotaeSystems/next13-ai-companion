import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/isAdmin";
import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function PATCH(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    console.log("inside of PATCH /api/companion/[companionId]/routes");
    //const user = await currentUser();

    // check to see if logged-in user is admin and active /////////
    // check if signed in with Clerk
    const { userId } = auth();

    if (!userId) {
      console.log("not logged in with Clerk");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log("logged in");

    // check to see if logged-in user is Admin and is Active
    let userIsAdmin = await isAdmin(userId);
    if (!userIsAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    ////////////////////////////////////////////////////////////////

    const body = await req.json();
    const {
      src,
      adminStatus,
      name,
      namespace,
      status,
      role,
      description,
      // instructions,
      temperature,
      // seed,
      relationship,
      pineconeIndex,
      voiceId,
      categoryId,
    } = body;

    console.log("role: " + role);

    if (
      !src ||
      !adminStatus ||
      !name ||
      !namespace ||
      !status ||
      !description ||
      !role ||
      // !instructions ||
      // !seed ||
      !categoryId
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const isPro = await checkSubscription();

    if (!isPro) {
      return new NextResponse("Pro subscription required", { status: 403 });
    }

    const companion = await prismadb.companion.update({
      where: {
        id: params.companionId,
        //userId: user.id,
      },
      data: {
        categoryId,
        //userId: user.id,
        // userName: user.firstName,
        src,
        adminStatus,
        name,
        namespace,
        status,
        role,
        description,
        // instructions,
        pineconeIndex,
        temperature,
        // seed,
        relationship,
        voiceId,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_PATCH]", error);
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
