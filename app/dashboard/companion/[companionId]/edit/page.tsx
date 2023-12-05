import Global from "@/Global.js";
import { Debugging } from "@/lib/debugging";
import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

import { CompanionForm } from "./components/companion-form";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";
interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

const EditCompanionPage = async ({ params }: CompanionIdPageProps) => {
  const { userId } = auth();
  Debugging("inside of /dashboard/companion/[companinId] EditCompanionPage");

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
    Debugging("companion Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }
  const categories = await prismadb.category.findMany();
  // check to see if relationship exists
  let relationship = null;
  relationship = await prismadb.relationship.findFirst({
    where: {
      companionId: companion.id,
      userId: userId,
    },
  });
  if (!relationship) {
    Debugging("Relationship Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }
  Debugging("getting ready to return");
  return (
    <>
      <CompanionNavbar companion={companion} relationship={relationship} />
      <h1> Edit Companion</h1>
      <CompanionForm companion={companion} categories={categories} />
    </>
  );
};

export default EditCompanionPage;
