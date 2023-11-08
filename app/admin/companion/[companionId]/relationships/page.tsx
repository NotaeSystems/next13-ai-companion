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
import { AdminCompanionNavbar } from "@/components/navbars/admin-companion-navbar";
import { AdminCompanions } from "@/components/admin/admin-companions";
import { redirect } from "next/navigation";
interface RelationshipsPageProps {
  params: {
    companionId: string;
  };
}

const RelationshipsPage = async ({ params }: RelationshipsPageProps) => {
  // const categories = await prismadb.category.findMany();
  console.log("inside of admin/relationships");
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

  const relationships = await prismadb.relationship.findMany({});

  const data: any = relationships;
  let companion = null;

  companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      userId,
    },
  });

  if (!companion) {
    return redirect("/admin");
  }
  return (
    <div className="h-full p-4 space-y-2">
      <AdminCompanionNavbar companion={companion} />
      <h1>Relationships of {companion.name}</h1>
      <h2>Under Construction</h2>
    </div>
  );
};

export default RelationshipsPage;
