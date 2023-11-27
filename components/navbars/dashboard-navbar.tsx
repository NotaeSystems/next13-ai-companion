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
          <div>
            <h1>Dashboard</h1>
          </div>
          <div>
            <Button>
              <Link href="/dashboard">
                <h1 className={cn("font-bold")}>Subscribed Personas</h1>
              </Link>
            </Button>
          </div>
          <div>
            <Button>
              <Link href="/dashboard/owned">
                <h1 className={cn("font-bold")}>Owned Personas</h1>
              </Link>
            </Button>
          </div>
          <div>
            <Button>
              <Link href="/dashboard/profile/{userId}">
                <h1 className={cn("font-bold")}>Your Profile</h1>
              </Link>
            </Button>
          </div>

          <div>
            <Button>
              <Link href="/dashboard/billing">
                <h1 className={cn("font-bold ")}>Billing</h1>
              </Link>
            </Button>
          </div>
          {/* 
          <SignedOut>
            <div>
              <Button>
                <Link href="/sign-in">
                  <h1 className={cn("font-bold ")}>Sign In</h1>
                </Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href="/sign-up">
                  <h1 className={cn("font-bold ")}>Sign Up</h1>
                </Link>
              </Button>
            </div>
          </SignedOut>

          <SignedIn>
            <div>
              <Button>
                <Link href="/dashboard">
                  <h1 className={cn("font-bold")}>Dashboard</h1>
                </Link>
              </Button>
            </div>

            <UserButton afterSignOutUrl="/" />
          </SignedIn> */}
        </nav>
      </div>
    </div>
  );
};
