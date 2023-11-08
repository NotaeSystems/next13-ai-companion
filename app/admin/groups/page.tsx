import prismadb from "@/lib/prismadb";
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

  return (
    <div className="h-full p-4 space-y-2">
      <h1>Groups</h1>
      <h2>Under Construction</h2>
    </div>
  );
};

export default GroupsAdminPage;
