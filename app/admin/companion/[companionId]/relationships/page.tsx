import Global from "@/Global.js";
import { Debugging } from "@/lib/debugging";
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

interface RelationshipsAdminPageProps {
  params: {
    companionId: string;
  };
}

const RelationshipsAdminPage = async ({
  params,
}: RelationshipsAdminPageProps) => {
  // const categories = await prismadb.category.findMany();
  Debugging(`inside of admin/companions/$[companionID]/relationships`);
  const { userId } = auth();
  Debugging(`${userId}`);

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

  {
    try {
      companion = await prismadb.companion.findUnique({
        where: {
          id: params.companionId,
        },
        include: {
          relationships: true,
        },
      });
    } catch (error) {
      return <>Cannot find Persona"</>;
    }
  }

  if (!companion) {
    return (
      <>
        <p>Cannot find Persona</p>
      </>
    );
  }
  const relationships = await prismadb.relationship.findMany({
    where: {
      companionId: params.companionId,
    },
  });

  // const relationships: Relationship[] = companion.relationships;

  return (
    <div className="h-full p-4 space-y-2">
      <AdminCompanionNavbar companion={companion} />
      <h1>Relationships of {companion.name} </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
        {relationships.map((relationship: Relationship) => (
          <Card
            key={relationship.id}
            className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
          >
            <Link
              href={`/admin/companion/${relationship.companionId}/relationship/${relationship.id}`}
            >
              <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
                {/* <div className="relative w-32 h-32">
                <Image
                  src={companion.src}
                  fill
                  className="rounded-xl object-cover"
                  alt="Character"
                />
              </div> */}
                <p className="font-bold">{relationship.title}</p>
                {/* <p className="font-bold">{relationship.content} xxxx</p> */}
                {/* <p className="text-xs">{item.description}</p> */}
              </CardHeader>
              <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                {/* <p className="lowercase">@{item.userName}</p>
                <div className="flex items-center">
                  <MessagesSquare className="w-3 h-3 mr-1" />
                  {item._count.messages}
                </div> */}
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelationshipsAdminPage;
