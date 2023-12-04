import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

import { CompanionForm } from "./components/companion-form";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";
import { OwnerCompanionNavbar } from "@/components/navbars/owner/owner-companion-navbar";
interface OwnerCompanionIdPageProps {
  params: {
    companionId: string;
  };
}

const OwnerEditCompanionPage = async ({
  params,
}: OwnerCompanionIdPageProps) => {
  const { userId } = auth();
  console.log("inside of EditCompanionPage");

  if (!userId) {
    return redirectToSignIn();
  }

  const validSubscription = await checkSubscription();

  // if (!validSubscription) {
  //   return redirect("/");
  // }

  // looking up companion, if userId of companion is the same as logged-in user then can edit
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
    console.log("companion Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }

  const relationship = await prismadb.relationship.findFirst({
    where: {
      companionId: params.companionId,
      userId,
    },
  });
  if (!relationship) {
    console.log("Relationship Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }

  const categories = await prismadb.category.findMany();

  console.log("getting ready to return");
  return (
    <>
      <OwnerCompanionNavbar companion={companion} relationship={relationship} />
      <h1> Edit {companion.name}</h1>
      <CompanionForm companion={companion} categories={categories} />
    </>
  );
};

export default OwnerEditCompanionPage;
