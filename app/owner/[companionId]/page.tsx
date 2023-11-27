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

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

export default async function CompanionIdPage({
  params,
}: CompanionIdPageProps) {
  console.log("made it to /dashboard/companion/[companionId]");
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  const validSubscription = await checkSubscription();

  if (!validSubscription) {
    console.log("redirecting to /dashboard did not find subscription");
    return redirect("/");
  }

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
  // const categories = await prismadb.category.findMany();

  //check if this if first time to chat with companion. If so need to establish relationship
  console.log("getting ready to check for relationship");
  // check to see if relationship exists
  let relationship = null;
  relationship = await prismadb.relationship.findFirst({
    where: {
      companionId: companion.id,
      userId: user.id,
    },
  });

  let profileName = null;

  // if (!relationship) {
  //   console.log("Did not find relationship");
  //   let profile = await prismadb.profile.findFirst({
  //     where: {
  //       userId: user.id,
  //     },
  //   });
  //   if (!profile) {
  //     console.log("Did not find profile");
  //     return redirectToSignIn();
  //   }

  //   const profileName =
  //     profile.firstName + " " + profile.lastName + " - " + companion.name;

  //   console.log(
  //     "getting ready to create new relationship for:  " + profileName
  //   );
  //   relationship = await prismadb.relationship.create({
  //     data: {
  //       userId: user.id,
  //       profileId: profile.id,
  //       companionId: companion.id,
  //       role: "User",
  //       title: profileName,
  //       status: "Active",
  //       adminStatus: "Active",
  //       name: profile.firstName + " " + profile.lastName,
  //       nickNames: profile.nickNames,

  //       // content: "You are a friendly stranger to Assistant",
  //     },
  //   });
  //   return redirect(`/dashboard/relationships/${relationship.id}`);
  // }

  // if (
  //   relationship.adminStatus === "Active" &&
  //   relationship.status != "Active"
  // ) {
  //   console.log("Relation being reactivated");
  //   relationship = await prismadb.relationship.update({
  //     where: {
  //       id: relationship.id,
  //     },
  //     data: {
  //       status: "Active",
  //     },
  //   });
  // }
  console.log(relationship.title);

  return (
    <>
      <OwnerCompanionNavbar companion={companion} relationship={relationship} />
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
