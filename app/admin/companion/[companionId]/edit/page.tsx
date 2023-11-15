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
  console.log("inside of EditCompanionPage");

  if (!userId) {
    return redirectToSignIn();
  }

  const validSubscription = await checkSubscription();

  // if (!validSubscription) {
  //   return redirect("/");
  // }

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
    console.log("companion Not Found");
    return redirect("/dashboard");
  }
  const categories = await prismadb.category.findMany();

  console.log("getting ready to return");
  return (
    <>
      <CompanionNavbar companion={companion} />
      <h1> Edit Companion</h1>
      <CompanionForm companion={companion} categories={categories} />
    </>
  );
};

export default EditCompanionPage;
