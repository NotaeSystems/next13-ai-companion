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
import { Profile } from "@prisma/client";
import Image from "next/image";

const font = Poppins({ weight: "600", subsets: ["latin"] });

interface AdminProfileNavBarProps {
  profile: Profile;
}

export const AdminProfileNavbar = ({ profile }: AdminProfileNavBarProps) => {
  return (
    <>
      <div className="w-full h-20 bg-red-400 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <nav className="flex justify-between items-center h-full">
            <div>
              <h1>Profile Navbar </h1>
            </div>
            {/* <div>
              {/* <Link href={`/admin/companion/${profile.id}`}>
                <Image
                  src={profile.src}
                  className="rounded-xl object-cover"
                  alt="Profile"
                  width={35}
                  height={35}
                />
              </Link>
            </div> */}
            <div>
              <h1>{profile.firstName + " " + profile.lastName}</h1>
            </div>
            <div>
              <Button>
                <Link href={`/admin/profile/${profile.id}/relationships`}>
                  Relationships
                </Link>
              </Button>
              {/* <Button>
              <Link href={`/dashboard/companion/${companion.id}/chat`}>Chat</Link>
            </Button> */}
              <Button>
                <Link href={`/admin/profile/${profile.id}/edit`}>Edit</Link>
              </Button>
              <Button>
                <Link href={`/admin/profile/${profile.id}/conversations`}>
                  Conversations
                </Link>
              </Button>
              {/* <Button>
                <Link href={`/admin/companion/${companion.id}/notes`}>
                  Notes
                </Link>
              </Button> */}
            </div>
          </nav>
        </div>
      </div>

      {/* <CompanionForm initialData={companion} categories={categories} /> */}
    </>
  );
};
