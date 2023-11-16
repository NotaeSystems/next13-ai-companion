import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { Category, Companion } from "@prisma/client";
import { CompanionForm } from "./components/companion-form";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";
interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

const NewCompanionAdminPage = async ({ params }: CompanionIdPageProps) => {
  const { userId } = auth();
  console.log("inside of /admin/new/companion");

  if (!userId) {
    return redirectToSignIn();
  }

  const validSubscription = await checkSubscription();

  // if (!validSubscription) {
  //   return redirect("/");
  // }

  // looking up companion, if userId of companion is the same as logged-in user then can edit
  let companion = null;
  // if (params.companionId != "new") {
  //   companion = await prismadb.companion.findUnique({
  //     where: {
  //       id: params.companionId,
  //       userId,
  //     },
  //   });
  // }
  // if (!companion) {
  //   console.log("companion Not Found. Is user the owner of the companion?");
  //   return redirect("/dashboard");
  // }
  const categories = await prismadb.category.findMany();

  console.log("getting ready to return new companion form");
  return (
    <>
      {/* <CompanionNavbar companion={companion} /> */}
      <h1> New Companion</h1>
      <CompanionForm initialData={companion} categories={categories} />
    </>
  );
};

export default NewCompanionAdminPage;
