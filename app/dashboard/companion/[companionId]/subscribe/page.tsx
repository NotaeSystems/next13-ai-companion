import Global from "@/Global.js";
import { Debugging } from "@/lib/debugging";
import { redirect } from "next/navigation";
import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

// import { CompanionForm } from "./components/companion-form";
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
  Debugging("made it to /dashboard/companion/[companionId]");
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
    Debugging("redirecting to /dashboard did not find subscription");
    return redirect("/");
  }

  let companion = null;

  companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
    },
  });

  if (!companion) {
    Debugging("redirecting to /dashboard did not find Persona");
    return redirect("/dashboard");
  }
  console.log("Admin Status: " + companion.adminStatus);
  if (companion.adminStatus === "Suspended") {
    return (
      <>
        <div className="text-xl text-red-500 col-span-full text-center">
          <div>{companion.name}</div>
          {"Relationship has been Suspended."}
        </div>
      </>
    );
  }

  //check if this if first time to chat with Persona. If so need to establish relationship
  Debugging("getting ready to check for relationship");

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
    Debugging("Did not find relationship");
    let profile = await prismadb.profile.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (!profile) {
      Debugging("Did not find profile");
      return redirectToSignIn();
    }

    const profileName =
      profile.firstName + " " + profile.lastName + " - " + companion.name;

    Debugging("getting ready to create new relationship for:  " + profileName);
    relationship = await prismadb.relationship.create({
      data: {
        userId: user.id,
        profileId: profile.id,
        companionId: companion.id,
        role: "User",
        title: profileName,
        status: "Active",
        adminStatus: "Active",
        name: profile.firstName + " " + profile.lastName,
        nickNames: profile.nickNames,

        // content: "You are a friendly stranger to Assistant",
      },
    });
    return redirect(`/dashboard/relationships/${relationship.id}`);
  }

  Debugging(`${relationship.title}`);
  if (relationship.status != "Active" && relationship.adminStatus != "Active") {
    Debugging("redirecting to /dashboard. Relationship is not active");
    return redirect("/dashboard");
  }
  if (
    relationship.status === "Active" &&
    relationship.adminStatus === "Active" &&
    user.id === companion.userId
  ) {
    return (
      <>
        <OwnerCompanionNavbar
          companion={companion}
          relationship={relationship}
        />
        <h1 className="text-2xl text-center my-5 ">{companion.name}</h1>

        <div className="flex items-center justify-center">
          <Link
            href={`/dashboard/relationships/${relationship.id}/chats/voicechatting`}
          >
            <ImagePersonaLargeComponent companion={companion} />
          </Link>
        </div>

        <div className="flex justify-center">
          <p className="bg-gray-500 w-4/6 lg:w-600 text-xl my-5 ">
            {companion.description}
          </p>
        </div>
      </>
    );
  } else if (
    relationship.status === "Active" &&
    relationship.adminStatus === "Active"
  ) {
    return (
      <>
        <CompanionNavbar companion={companion} relationship={relationship} />
        <h1 className="text-2xl text-center my-5 ">{companion.name}</h1>

        <div className="flex items-center justify-center">
          <Link
            href={`/dashboard/relationships/${relationship.id}/chats/voicechatting`}
          >
            <ImagePersonaLargeComponent companion={companion} />
          </Link>
        </div>
        <p className="text-xl text-center my-5 ">{companion.description}</p>
      </>
    );
  } else if (
    relationship.adminStatus === "Active" &&
    relationship.status === "Inactive"
  ) {
    return (
      <>
        <div className="text-xl text-red-500 col-span-full text-center">
          <div>{companion.name}</div>
          {"Relationship has been Reactivated."}
        </div>
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
          <div>
            <Button>
              <Link
                href={`/dashboard/relationships/${relationship.id}/reactivate`}
              >
                Reactivate Your Relationship with {companion.name}
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
}
