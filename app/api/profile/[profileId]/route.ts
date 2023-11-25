import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
//import { checkSubscription } from "@/lib/subscription";
import { isAdmin } from "@/lib/admin/isAdmin";

export async function PATCH(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    console.log("inside of /api/profile");

    // authenicate user
    const user = await currentUser();
    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // pull fields from body of request
    const body = await req.json();
    const { firstName, lastName, nickNames, gender, educationLevel, ageLevel } =
      body;

    if (!params.profileId) {
      return new NextResponse("Profile ID required", { status: 400 });
    }

    let profile = null;
    profile = await prismadb.profile.update({
      where: {
        id: params.profileId,
      },
      data: {
        lastName,
        firstName,
        nickNames,
        gender,
        educationLevel,
        ageLevel,
      },
    });
    console.log(profile);

    return NextResponse.json(profile);
  } catch (error) {
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

    // only admin can delete a profile
    const isAdminStatus = isAdmin(userId);
    if (!isAdminStatus) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await prismadb.companion.delete({
      where: {
        userId,
        id: params.profileId,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
