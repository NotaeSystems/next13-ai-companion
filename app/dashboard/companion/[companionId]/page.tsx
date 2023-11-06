import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

import { CompanionForm } from "./components/companion-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";
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
    return redirect("/dashboard");
  }
  const categories = await prismadb.category.findMany();

  return (
    <>
      <CompanionNavbar companion={companion} />
      <h1>{companion.name}</h1>
      <p>{companion.description}</p>
    </>
  );
};

export default CompanionIdPage;
