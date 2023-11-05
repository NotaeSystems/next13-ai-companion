import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

import { CompanionForm } from "./components/companion-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
      <h1>{companion.name}</h1>
      <Image
        src={companion.src}
        width={250}
        height={250}
        alt="Picture of the author"
      />
      <Button>
        <Link href={`/dashboard/companion/${companion.id}/relationship`}>
          Relationship
        </Link>
      </Button>
      <Button>
        <Link href={`/dashboard/${companion.chatLink}/${companion.id}`}>
          Chat
        </Link>
      </Button>
      <Button>
        <Link href={`/dashboard/companion/${companion.id}/edit`}>Edit</Link>
      </Button>
      {/* <CompanionForm initialData={companion} categories={categories} /> */}
    </>
  );
};

export default CompanionIdPage;
