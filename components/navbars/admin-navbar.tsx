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

interface AdminNavbarProps {}

export const AdminNavbar = () => {
  return (
    <>
      <div className="w-full h-20 bg-red-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <nav className="flex justify-between items-center h-full">
            <div>
              <h1>Admin</h1>
            </div>

            <div>
              <Button>
                <Link href={`/admin`}>Admin</Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href={`/admin/companions`}>Companions</Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href={`/admin/profiles`}>User Profiles</Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href={`/admin/billing`}>Billing</Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href={`/admin/groups`}>Groups</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* <CompanionForm initialData={companion} categories={categories} /> */}
    </>
  );
};
