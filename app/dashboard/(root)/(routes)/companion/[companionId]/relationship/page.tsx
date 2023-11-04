import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { exists } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

//import { CompanionForm } from "@/components/companion-form";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
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
        userId,
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
  relationship = await prismadb.relationship.findFirst({
    where: {
      companionId: params.companionId,
      userId: userId,
    },
  });
  if (relationship) {
    return (
      <>
        <h1>You are already in a Relationship with {companion.name}</h1>
      </>
    );
  }
  // Create relationship between user and companion
  relationship = await prismadb.relationship.create({
    data: {
      userId: userId,
      companionId: companion.id,
      role: "user",
      content: "You are a friendly stranger to Assistant",
    },
  });
  //const categories = await prismadb.category.findMany();

  return <h1>You are now in a Relationship with Companion-{companion.name}</h1>;
};

export default CompanionIdPage;
