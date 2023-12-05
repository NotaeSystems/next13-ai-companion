import Global from "@/Global.js";
import { Debugging } from "@/lib/debugging";
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
import { OwnerCompanionNavbar } from "@/components/navbars/owner/owner-companion-navbar";

interface CompanionIdPageProps {
  params: {
    relationshipId: string;
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

  let relationship = null;
  // check to see if relationship exists
  relationship = await prismadb.relationship.findUnique({
    where: {
      id: params.relationshipId,
    },
  });

  if (!relationship) {
    return (
      <>
        <h1> No relationship found!</h1>
      </>
    );
  }

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
  //       adminStatus: "Active",
  //       status: "Active",
  //       companionId: params.companionId,
  //       role: "User",
  //       content: "You are a friendly stranger to Assistant",
  //     },
  //   });
  // }
  let companion = null;

  companion = await prismadb.companion.findUnique({
    where: {
      id: relationship.companionId,
    },
  });

  if (!companion) {
    return (
      <>
        <h1> No companion found!</h1>
      </>
    );
  }

  //const categories = await prismadb.category.findMany();
  if (companion.userId === relationship.userId) {
    return (
      <>
        <OwnerCompanionNavbar
          companion={companion}
          relationship={relationship}
        />
        {/* <h1 className="text-xl text-center my-5">
          You are now in a Relationship with Companion-{companion.name}
        </h1> */}
        <div className="flex justify-center col-auto"></div>
        <RelationshipForm companion={companion} relationship={relationship} />;
      </>
    );
  }
  return (
    <>
      <CompanionNavbar companion={companion} relationship={relationship} />
      {/* <h1 className="text-xl text-center my-5">
        You are now in a Relationship with Companion-{companion.name}
      </h1> */}
      <div className="flex justify-center col-auto"></div>
      <RelationshipForm companion={companion} relationship={relationship} />;
    </>
  );
};

export default RelationshipPage;
