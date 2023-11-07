import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function PATCH(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    console.log("inside of /api/profile");
    const body = await req.json();
    const user = await currentUser();
    const { firstName, lastName, gender, educationLevel, ageLevel } = body;

    //console.log("relationship: " + relationship);

    if (!params.profileId) {
      return new NextResponse("Relationship ID required", { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if (!status) {
    //   console.log("missing fields");
    //   return new NextResponse("Missing required fields", { status: 400 });
    // }

    // const isPro = await checkSubscription();

    // if (!isPro) {
    //   return new NextResponse("Pro subscription required", { status: 403 });
    // }

    let profile = null;
    profile = await prismadb.profile.update({
      where: {
        id: params.profileId,
      },
      data: {
        lastName,
        firstName,
        gender,
        educationLevel,
        ageLevel,
      },
    });
    console.log(profile);
    return NextResponse.json(profile);
  } catch (error) {
    // console.log("[COMPANION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cprofile = await prismadb.companion.delete({
      where: {
        userId,
        id: params.profileId,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    // console.log("[COMPANION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
