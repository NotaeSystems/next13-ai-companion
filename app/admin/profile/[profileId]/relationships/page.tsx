import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { CompanionsDashboard } from "@/components/companions-dashboard";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AdminCompanionNavbar } from "@/components/navbars/admin-companion-navbar";
import { AdminProfileNavbar } from "@/components/navbars/admin-profile-navbar";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
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
    include: {
      relationships: {
        include: {
          companion: true,
        },
      },
    },
  });

  // console.log("profile relationships: " + profile.relationships);
  if (!profile) {
    return redirect("/admin");
  }
  //
  const relationships = profile.relationships;

  return (
    <>
      <div className="h-full p-4 space-y-2">
        <AdminProfileNavbar profile={profile} />
        {/* <AdminCompanionNavbar companion={companion} />
        <h1>Chat with {companion.name}</h1> */}
        <h1 className="text-2xl text-center my-5 "> Your Personas</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
          {relationships.map((relationship: any) => (
            <Card
              key={relationship.id}
              className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
            >
              <Link
                // href={`/dashboard/${item.companion.chatLink}/${item.companion.id}`}
                href={`/admin/companion/${relationship.companionId}`}
              >
                <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
                  <div className="relative w-32 h-32">
                    <Image
                      src={relationship.companion.src}
                      fill
                      className="rounded-xl object-cover"
                      alt="Character"
                    />
                  </div>
                  <p className="font-bold">{relationship.companion.name}</p>
                  <p className="text-xs">
                    {relationship.companion.description}
                  </p>
                  <p> Status: {relationship.companion.status} </p>
                </CardHeader>
                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                  <p className="lowercase">
                    @{relationship.companion.userName}
                  </p>

                  {/* <div className="flex items-center">
                <MessagesSquare className="w-3 h-3 mr-1" />
                {item._count.messages}
              </div> */}
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileRelationshipsAdminPage;
