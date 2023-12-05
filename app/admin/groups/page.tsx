import Global from "@/Global";
import prismadb from "@/lib/prismadb";
import { ImageUnderConstructionComponent } from "@/components/image/image-under-construction.";

import { Categories } from "@/components/categories";
import { CompanionsDashboard } from "@/components/companions-dashboard";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
interface GroupsAdminPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const GroupsAdminPage = async ({ searchParams }: GroupsAdminPageProps) => {
  // const { userId } = auth();
  // console.log(userId);
  // if (!userId) {
  //   return redirectToSignIn();
  // }

  const groups = await prismadb.group.findMany({});
  if (Global.underConstruction) {
    return (
      <>
        <div className="h-screen flex items-center justify-center">
          <ImageUnderConstructionComponent height={300} />
        </div>
      </>
    );
  }
  return (
    <div className="h-full p-4 space-y-2">
      <h1>Groups</h1>
    </div>
  );
};

export default GroupsAdminPage;
