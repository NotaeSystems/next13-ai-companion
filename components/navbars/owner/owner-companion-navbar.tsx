import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import {
  auth,
  currentUser,
  redirectToSignIn,
  SignedOut,
  SignedIn,
} from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { Companion, Relationship } from "@prisma/client";
import Image from "next/image";
import prismadb from "@/lib/prismadb";
import { ImagePersonaSmallComponent } from "@/components/image/image-persona-small";

const font = Poppins({ weight: "600", subsets: ["latin"] });

interface OwnerCompanionNavBarProps {
  companion: Companion;
  relationship: Relationship;
}

export const OwnerCompanionNavbar = async ({
  companion,
  relationship,
}: OwnerCompanionNavBarProps) => {
  console.log("inside of owner-companion-navbar");
  console.log("relationship: " + relationship.title);

  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  if (user.id != companion.userId) {
    return (
      <>
        <h1>Not Authorized</h1>
      </>
    );
  }
  return (
    <>
      <div className="w-full h-20 bg-yellow-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <nav className="flex justify-between items-center h-full">
            <div>Owner Persona</div>

            <div>
              <Link href={`/owner/${companion.id}`}>
                <ImagePersonaSmallComponent companion={companion} />
              </Link>
            </div>

            <div>{companion.name}</div>

            <div>
              <Button>
                <Link
                  href={`/dashboard/relationships/${relationship.id}/chats/streaming`}
                >
                  Chat Streaming
                </Link>
              </Button>
            </div>
            <div>
              <Button>
                <Link
                  href={`/dashboard/relationships/${relationship.id}/chats/voicechatting`}
                >
                  Chat VoiceChatting
                </Link>
              </Button>
            </div>
            <div>
              <Button>
                <Link
                  href={`/dashboard/relationships/${relationship.id}/chats/patient`}
                >
                  Chat Patient
                </Link>
              </Button>
            </div>
            <div>
              <Button>
                <Link href={`/dashboard/chat/${companion.id}`}>
                  Chat Completion
                </Link>
              </Button>
            </div>
            <div>
              <Button>
                <Link href={`/dashboard/relationships/${relationship.id}`}>
                  Your Relationship
                </Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href={`/owner/${companion.id}/relationships`}>
                  Personas Relationships
                </Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href={`/owner/${companion.id}/edit`}>Edit</Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href={`/owner/${companion.id}/invitations`}>
                  Invitations
                </Link>
              </Button>
            </div>

            {relationship.adminAddPersonaNotes === "Yes" ? (
              <div>
                <Button>
                  <Link href={`/owner//${companion.id}/notes`}>
                    Persona Notes
                  </Link>
                </Button>
              </div>
            ) : null}
          </nav>
        </div>
      </div>

      {/* <CompanionForm initialData={companion} categories={categories} /> */}
    </>
  );
};
