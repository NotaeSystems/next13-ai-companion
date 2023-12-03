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

const font = Poppins({ weight: "600", subsets: ["latin"] });

export const DashboardNavbar = () => {
  const { userId } = auth();

  return (
    <div className="w-full h-20 bg-blue-800 sticky top-0">
      <div className="container mx-auto px-4 h-full">
        <nav className="flex justify-between items-center h-full">
          <div>Dashboard</div>
          <div>
            <Button>
              <Link href="/dashboard">Subscribed Personas</Link>
            </Button>
          </div>
          <div>
            <Button>
              <Link href="/dashboard/owned">Owned Personas</Link>
            </Button>
          </div>
          <div>
            <Button>
              <Link href="/dashboard/profile/{userId}">Your Profile</Link>
            </Button>
          </div>

          <div>
            <Button>
              <Link href="/dashboard/billing">Billing</Link>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};
