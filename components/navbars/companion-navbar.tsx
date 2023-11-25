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

const font = Poppins({ weight: "600", subsets: ["latin"] });

interface CompanionNavBarProps {
  companion: Companion;
  relationship: Relationship;
}

export const CompanionNavbar = async ({
  companion,
  relationship,
}: CompanionNavBarProps) => {
  console.log("inside of companion-navbar");
  console.log("relationship: " + relationship.title);

  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }

  return (
    <>
      <div className="w-full h-20 bg-yellow-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <nav className="flex justify-between items-center h-full">
            <div>
              <h1>Persona</h1>
            </div>

            <div>
              <Link href={`/dashboard/companion/${companion.id}`}>
                <Image
                  src={companion.src}
                  className="rounded-xl object-cover"
                  alt="Character"
                  width={35}
                  height={35}
                />
              </Link>
            </div>

            <div>
              <h1>{companion.name}</h1>
            </div>

            <div>
              <Button>
                <Link
                  href={`/dashboard/relationships/${relationship.id}/chats/streaming`}
                >
                  Chat
                </Link>
              </Button>
            </div>
            <div>
              <Button>
                <Link href={`/dashboard/relationships/${relationship.id}`}>
                  Relationship
                </Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link
                  href={`/dashboard/relationships/${relationship.id}/notes`}
                >
                  Relationship Notes
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* <CompanionForm initialData={companion} categories={categories} /> */}
    </>
  );
};
