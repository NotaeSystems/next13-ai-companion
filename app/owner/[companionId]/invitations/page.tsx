import { redirect } from "next/navigation";
import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

import { CompanionForm } from "./components/companion-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";
import { OwnerCompanionNavbar } from "@/components/navbars/owner/owner-companion-navbar";
import { ImagePersonaLargeComponent } from "@/components/image/image-persona-large";

interface OwnerInvitationsPageProps {
  params: {
    companionId: string;
  };
}

export default async function OwnerInvitationsPage({
  params,
}: OwnerInvitationsPageProps) {
  console.log("made it to /dashboard/companion/[companionId]");
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  // const validSubscription = await checkSubscription();

  // if (!validSubscription) {
  //   console.log("redirecting to /dashboard did not find subscription");
  //   return redirect("/");
  // }

  let companion = null;

  companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
    },
  });

  if (!companion) {
    console.log("redirecting to /dashboard did not find companion");
    return redirect("/dashboard");
  }
  console.log("Admin Status: " + companion.adminStatus);
  if (companion.adminStatus === "Suspended") {
    return (
      <>
        <div className="text-xl text-red-500 col-span-full text-center">
          <div>{companion.name}</div>
          {"Persona has been Suspended."}
        </div>
      </>
    );
  }

  console.log("getting ready to check for relationship");
  const relationship = await prismadb.relationship.findFirst({
    where: {
      companionId: companion.id,
      userId: userId,
    },
  });

  if (!relationship) {
    console.log("Relationship Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }
  if (user.id != companion.userId) {
    console.log("user is not the owner");
    return redirect("/dashboard");
  }

  console.log(relationship.title);

  return (
    <>
      <OwnerCompanionNavbar companion={companion} relationship={relationship} />
      <h1 className="text-2xl text-center my-5 ">
        Invitations - Under Constructions
      </h1>
      <h1 className="text-2xl text-center my-5 ">{companion.name}</h1>

      <div className="flex items-center justify-center">
        <Link
          href={`/dashboard/relationships/${relationship.id}/chats/streaming`}
        >
          <ImagePersonaLargeComponent companion={companion} />
        </Link>
      </div>
      <p className="text-xl text-center my-5 ">{companion.description}</p>
    </>
  );
}
