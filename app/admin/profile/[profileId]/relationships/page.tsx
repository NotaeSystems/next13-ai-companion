import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { CompanionsDashboard } from "@/components/companions-dashboard";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AdminCompanionNavbar } from "@/components/navbars/admin-companion-navbar";

interface ProfileRelationshipsAdminPageProps {
  params: {
    profileId: string;
  };
}

const ProfileRelationshipsAdminPage = async ({
  params,
}: ProfileRelationshipsAdminPageProps) => {
  const { userId } = auth();
  console.log(userId);
  if (!userId) {
    return redirectToSignIn();
  }

  let profile = null;

  profile = await prismadb.profile.findUnique({
    where: {
      id: params.profileId,
    },
  });
  // console.log("profile relationships: " + profile.relationships);
  // if (!companion) {
  //   return redirect("/admin");
  // }

  return (
    <>
      <div className="h-full p-4 space-y-2">
        {/* <AdminCompanionNavbar companion={companion} />
        <h1>Chat with {companion.name}</h1> */}
        <h2>Under Construction</h2>
      </div>
    </>
  );
};

export default ProfileRelationshipsAdminPage;
