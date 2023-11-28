import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
// import { AdminDashboard } from "@/components/admin/admin-companions";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NextResponse } from "next/server";
import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs";
import { AdminCompanionNavbar } from "@/components/navbars/admin-companion-navbar";
import { AdminCompanions } from "@/components/admin/admin-companions";
import { redirect } from "next/navigation";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Companion, Relationship } from "@prisma/client";
import { OwnerCompanionNavbar } from "@/components/navbars/owner/owner-companion-navbar";
import { RelationshipForm } from "./components/relationship-form";
interface DashboardCompanionOwnerRelationshipPageProps {
  params: {
    companionId: string;
    relationshipId: string;
  };
}

const DashboardCompanionOwnerRelationshipPage = async ({
  params,
}: DashboardCompanionOwnerRelationshipPageProps) => {
  // const categories = await prismadb.category.findMany();

  console.log(
    "inside of dashboard/companions/[companionID]/owner/relationship"
  );
  const { userId } = auth();
  console.log(userId);

  if (!userId) {
    return redirectToSignIn();
  }
  const user = await currentUser();
  let profile = null;
  profile = await prismadb.profile.findFirst({
    where: { userId: userId, role: "Admin" },
  });

  if (!profile) {
    return new NextResponse("Not Authorized", { status: 404 });
  }

  //const data: any = relationships;
  let companion: Companion | null;

  companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
    },
    include: {
      relationships: true,
    },
  });

  if (!companion) {
    return redirect("/admin");
  }

  const relationship = await prismadb.relationship.findFirst({
    where: {
      id: params.relationshipId,
    },
  });
  if (!relationship) {
    console.log("Relationship Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }

  // const relationships = await prismadb.relationship.findMany({
  //   where: {
  //     companionId: companion.id,
  //     // status: "Active",

  //     // name: {
  //     //   search: searchParams.name,
  //     // },
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   include: {
  //     companion: true,
  //   },
  // });
  // const relationships = companion.relationships;
  return (
    <div className="h-full p-4 space-y-2">
      <OwnerCompanionNavbar companion={companion} relationship={relationship} />
      <h1>{relationship.title}</h1>
      <Button>
        <Link
          href={`/owner/${companion.id}/relationship/${relationship.id}/notes`}
        >
          Relationship Notes
        </Link>
      </Button>
      <RelationshipForm
        companion={companion}
        relationship={relationship}
      ></RelationshipForm>
    </div>
  );
};

export default DashboardCompanionOwnerRelationshipPage;
