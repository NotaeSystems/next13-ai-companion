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
      <div className="w-full h-20 bg-pink-200 sticky top-0">
        <div className="flex justify-center">
          <div className="bg-black left-2">
            <h1>Admin</h1>
          </div>
          <div>
            <Button>
              <Link href={`/admin/companions`}>Companions</Link>
            </Button>
            <Button>
              <Link href={`/admin/profiles`}>Profiles</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* <CompanionForm initialData={companion} categories={categories} /> */}
    </>
  );
};
