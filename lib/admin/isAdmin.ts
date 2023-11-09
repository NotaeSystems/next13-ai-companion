import { Profile } from "@prisma/client";
import prismadb from "@/lib/prismadb";

export async function isAdmin(userId: string) {
  // check if logged-in user has role of Admin and is Active
  console.log("inside of isAdmin");
  let adminProfile = null;
  adminProfile = await prismadb.profile.findFirst({
    where: { userId: userId, role: "Admin", status: "Active" },
  });

  if (!adminProfile) {
    console.log("not logged in as Admin: ");
    return false;
  }
  console.log("profile.status: " + adminProfile.status);
  return true;
  ///////////////////////////////////////////////////////////

  return isAdmin;
}
