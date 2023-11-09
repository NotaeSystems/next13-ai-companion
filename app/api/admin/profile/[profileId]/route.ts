import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/isAdmin";
import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function PATCH(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    console.log("inside of /api/admin/profile");

    // first check to see if there is a profileId. May not be necesary?
    if (!params.profileId) {
      return new NextResponse("Profile ID required", { status: 400 });
    }
    const body = await req.json();

    // check to see if logged-in user is admin and active
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
    ///////////////////////////////////

    // logged-in user has role of Admin and status is Active. We now update the profile
    const { status, firstName, lastName, gender, educationLevel, ageLevel } =
      body;

    let profile = null;
    profile = await prismadb.profile.update({
      where: {
        id: params.profileId,
      },
      data: {
        status,
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

    const profile = await prismadb.companion.delete({
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
