import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { RelationshipsDashboard } from "@/components/relationships-dashboard";
import { SearchInput } from "@/components/search-input";
// import { MainNavbar } from "@/components/navbars/main-navbar";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const DashboardRootPage = async ({ searchParams }: RootPageProps) => {
  const categories = await prismadb.category.findMany();
  const { userId } = auth();
  console.log(userId);
  if (!userId) {
    return redirectToSignIn();
  }

  // find all the active relationships between logged-in user and companion

  const activeRelationships = await prismadb.relationship.findMany({
    where: { userId: userId, status: "Active", adminStatus: "Active" },

    include: { companion: true },
  });

  return (
    <>
      <div className="h-full p-4 space-y-2">
        <RelationshipsDashboard relationships={activeRelationships} />
      </div>
    </>
  );
};

export default DashboardRootPage;
