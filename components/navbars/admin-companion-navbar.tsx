//Admin Companion Navbar
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { auth, redirectToSignIn, SignedOut, SignedIn } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { Companion } from "@prisma/client";
import Image from "next/image";

const font = Poppins({ weight: "600", subsets: ["latin"] });

interface AdminCompanionNavBarProps {
  companion: Companion;
}

export const AdminCompanionNavbar = ({
  companion,
}: AdminCompanionNavBarProps) => {
  return (
    <>
      <div className="w-full h-20 bg-red-500 sticky top-0">
        <div className="flex justify-center">
          <div className="bg-black left-2">
            <h1>Admin Companion Navbar</h1>
          </div>
          <Link href={`/admin/companion/${companion.id}`}>
            <Image
              src={companion.src}
              className="rounded-xl object-cover"
              alt="Character"
              width={50}
              height={50}
            />
            <h1>{companion.name}</h1>
          </Link>
          <div>
            <Button>
              <Link href={`/admin/companion/${companion.id}/relationships`}>
                Relationships
              </Link>
            </Button>
            {/* <Button>
              <Link href={`/dashboard/companion/${companion.id}/chat`}>Chat</Link>
            </Button> */}
            <Button>
              <Link href={`/admin/companion/${companion.id}/edit`}>Edit</Link>
            </Button>
            <Button>
              <Link href={`/admin/companion/${companion.id}/conversations`}>
                Conversations
              </Link>
            </Button>
            <Button>
              <Link href={`/admin/companion/${companion.id}/notes`}>Notes</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* <CompanionForm initialData={companion} categories={categories} /> */}
    </>
  );
};
