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

interface RelationshipAdminNavBarProps {
  relationship: Relationship;
  companion: Companion;
}

export const RelationshipAdminNavbar = async ({
  relationship,
  companion,
}: RelationshipAdminNavBarProps) => {
  console.log("inside of relationship-admin-navbar");

  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }

  return (
    <>
      <div className="w-full h-20 bg-red-800 sticky top-0">
        <div>
          <h1>Admin Relationship Navbar</h1>
        </div>
        <div className="flex justify-center">
          {/* <Link href={`/dashboard/companion/${companion.id}`}>
            <Image
              src={companion.src}
              className="rounded-xl object-cover"
              alt="Character"
              width={50}
              height={50}
            />
            <h1>{companion.name}</h1>
          </Link> */}
          <div>
            <Button>
              <Link
                href={`/admin/companion/${companion.id}/relationship/${relationship.id}`}
              >
                Relationship
              </Link>
            </Button>
            <Button>
              <Link
                href={`/admin/companion/${companion.id}/relationship/${relationship.id}/notes`}
              >
                Notes
              </Link>
            </Button>
            {/* 
            <Button>
              <Link href={`/dashboard/companion/${companion.id}/chats/chat`}>
                Basic Chat
              </Link>
            </Button> */}

            <Button>
              <Link href={`/dashboard/companion/${companion.id}/chats/notes`}>
                Notes Chat
              </Link>
            </Button>

            {/* <Button>
              <Link href={`/dashboard/companion/${companion.id}/edit`}>
                Edit
              </Link>
            </Button> */}
            {/* <Button>
              <Link href={`/dashboard/companion/${companion.id}/notes`}>
                Notes
              </Link>
            </Button> */}
          </div>
        </div>
      </div>

      {/* <CompanionForm initialData={companion} categories={categories} /> */}
    </>
  );
};
