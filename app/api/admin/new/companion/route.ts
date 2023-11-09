import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/isAdmin";
import prismadb from "@/lib/prismadb";
//import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    console.log("inside of /api/new/companion");
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, voiceId, categoryId } =
      body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // check to see if logged-in user is admin and active /////////
    // check if signed in with Clerk
    const { userId } = auth();

    if (!userId) {
      console.log("not logged in");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log("logged in");

    // check to see if logged-in user is Admin and is Active
    let userIsAdmin = await isAdmin(userId);
    if (!userIsAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    ////////////////////////////////////////////////////////////////
    if (
      !src ||
      !name ||
      !description ||
      !instructions ||
      !seed ||
      !categoryId
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // const isPro = await checkSubscription();

    // if (!isPro) {
    //   return new NextResponse("Pro subscription required", { status: 403 });
    // }

    const companion = await prismadb.companion.create({
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
        voiceId,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
