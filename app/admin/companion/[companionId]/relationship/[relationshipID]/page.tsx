import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { exists } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

import { RelationshipForm } from "./components/relationship-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";
import { AdminCompanionNavbar } from "@/components/navbars/admin-companion-navbar";
import { RelationshipAdminNavbar } from "@/components/navbars/admin-relationship-navbar";

interface CompanionIdPageProps {
  params: {
    companionId: string;
    relationshipID: string;
  };
}

const RelationshipPage = async ({ params }: CompanionIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const validSubscription = await checkSubscription();

  if (!validSubscription) {
    return redirect("/");
  }

  let companion = null;
  if (params.companionId != "new") {
    companion = await prismadb.companion.findUnique({
      where: {
        id: params.companionId,
      },
    });
  }
  if (!companion) {
    return (
      <>
        <h1> No companion found!</h1>
      </>
    );
  }

  let relationship = null;
  // check to see if relationship exists
  relationship = await prismadb.relationship.findUnique({
    where: {
      id: params.relationshipID,
    },
  });
  // if (relationship) {
  //   return (
  //     <>
  //       <h1>You are already in a Relationship with {companion.name}</h1>
  //     </>
  //   );
  // }
  // Create relationship between user and companion
  // if (!relationship) {
  //   relationship = await prismadb.relationship.create({
  //     data: {
  //       userId: userId,
  //       companionId: companion.id,
  //       role: "user",
  //       content: "You are a friendly stranger to Assistant",
  //     },
  //   });
  // }
  //const categories = await prismadb.category.findMany();

  if (!relationship) throw Error("userId undefined");

  return (
    <>
      <AdminCompanionNavbar companion={companion} />
      <RelationshipAdminNavbar
        companion={companion}
        relationship={relationship}
      />
      <h1 className="text-lg font-medium">{relationship.title}</h1>
      <div className="flex justify-center col-auto">
        <h1>{companion.name}</h1>
      </div>
      {/* <div className="flex justify-center col-auto">
        <Image
          src={companion.src}
          width={125}
          height={125}
          alt="Picture of the author"
        />
      </div> */}
      <div>
        <Button>
          <Link
            href={`/dashboard/relationships/${relationship.id}/chats/voicechatting`}
          >
            Chat VoiceChatting
          </Link>
        </Button>
      </div>
      <RelationshipForm companion={companion} relationship={relationship} />;
    </>
  );
};

export default RelationshipPage;
