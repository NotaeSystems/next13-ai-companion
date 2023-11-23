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
  console.log(
    "inside of relationship-admin-navbar. RelationshipId: " + relationship.id
  );

  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }

  return (
    <>
      <div className="w-full h-20 bg-red-300 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <nav className="flex justify-between items-center h-full">
            <div>
              <h1>Admin Relationship</h1>
            </div>
            <div>
              <h1>
                {user.firstName} {user.lastName}
              </h1>
            </div>
            {/* <div className="flex justify-center">
              <Link href={`/dashboard/companion/${companion.id}`}>
                <Image
                  src={companion.src}
                  className="rounded-xl object-cover"
                  alt="Character"
                  width={50}
                  height={50}
                />
                <h1>{companion.name}</h1>
              </Link>
            </div> */}

            <div>
              <Button>
                <Link
                  href={`/admin/companion/${companion.id}/relationship/${relationship.id}`}
                >
                  Relationship
                </Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link
                  href={`/admin/companion/${companion.id}/relationship/${relationship.id}/notes`}
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
