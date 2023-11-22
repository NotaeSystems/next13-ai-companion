import { redirect } from "next/navigation";
import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs";

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
  const categories = await prismadb.category.findMany();

  //check if this if first time to chat with compannion. If so need to establish relationship
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

  if (!relationship) {
    console.log("Did not find relationship");
    let profile = await prismadb.profile.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (!profile) {
      return redirectToSignIn();
    }

    profileName = profile.firstName + " " + profile.lastName;

    console.log(
      "getting ready to create new relationship for:  " + profileName
    );
    relationship = await prismadb.relationship.create({
      data: {
        userId: user.id,
        companionId: companion.id,
        role: "User",
        title: profileName,
        // content: "You are a friendly stranger to Assistant",
      },
    });
  }
  console.log(relationship.title);
  if (relationship.status != "Active" && relationship.adminStatus != "Status") {
    console.log("redirecting to /dashboard. Relationship is not active");
    return redirect("/dashboard");
  }

  if (
    relationship.status === "Active" &&
    relationship.adminStatus === "Active"
  ) {
    return (
      <>
        <CompanionNavbar companion={companion} relationship={relationship} />
        <h1>{companion.name}</h1>
        <p>{companion.description}</p>
      </>
    );
  } else if (relationship.adminStatus === "Suspended") {
    return (
      <>
        <div className="text-xl text-red-500 col-span-full text-center">
          <div>{companion.name}</div>
          {"Relationship has been Suspended at this time"}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="text-xl text-red-500 col-span-full text-center">
          <div>{companion.name}</div>
          {"Relationship is not Active at this time"}
        </div>
      </>
    );
  }
}
