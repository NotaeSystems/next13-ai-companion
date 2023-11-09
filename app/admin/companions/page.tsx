import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { CompanionsDashboard } from "@/components/companions-dashboard";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { AdminCompanions } from "@/components/admin/admin-companions";
interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const categories = await prismadb.category.findMany();
  const { userId } = auth();
  console.log(userId);
  if (!userId) {
    return redirectToSignIn();
  }

  // find all the active relationships between logged-in user and companion
  // TODO only find companions that status: Active

  const relationships = await prismadb.relationship.findMany({
    where: { userId: userId, status: "Active" },

    include: { companion: true },
  });

  const companions = await prismadb.companion.findMany({});

  const data: any = companions;
  return (
    <div className="h-full p-4 space-y-2">
      <Button>
        <Link href={`/admin/new/companion`}>Create New Companion</Link>
      </Button>
      {/* <Button>
        <Link href="/dashboard/profile/{userId}">Your Profile</Link>
      </Button>
      <Button>
        <Link href="/dashboard/settings">Billing</Link>
      </Button> */}
      {/* <CompanionsDashboard data={data} /> */}
      <AdminCompanions data={companions} />
      {/* <SearchInput /> 
      {<Categories data={categories} />} */}
    </div>
  );
};

export default RootPage;
