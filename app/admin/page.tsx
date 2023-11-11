import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
// import { AdminDashboard } from "@/components/admin/admin-companions";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NextResponse } from "next/server";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { AdminNavbar } from "@/components/navbars/admin-navbar";
import { AdminCompanions } from "@/components/admin/admin-companions";
interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async () => {
  // const categories = await prismadb.category.findMany();
  console.log("inside of admin");
  const { userId } = auth();
  console.log(userId);

  if (!userId) {
    return redirectToSignIn();
  }

  let profile = null;
  profile = await prismadb.profile.findFirst({
    where: { userId: userId, role: "Admin" },
  });

  if (!profile) {
    return new NextResponse("Not Authorized", { status: 404 });
  }

  const companions = await prismadb.companion.findMany();

  const data: any = companions;
  console.log("getting ready to return");
  return (
    <div className="h-full p-4 space-y-2">
      <h1>Admin Dashboard</h1>
      <Button>
        <Link href={`/admin/new/companion`}>Create New Companion</Link>
      </Button>
      <AdminCompanions data={companions} />
    </div>
  );
};

export default RootPage;
