import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { auth, redirectToSignIn, SignedOut, SignedIn } from "@clerk/nextjs";
// import { Sparkles } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
// import { MobileSidebar } from "@/components/mobile-sidebar";
// import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
// import { useProModal } from "@/hooks/use-pro-modal";

const font = Poppins({ weight: "600", subsets: ["latin"] });

// https://github.com/AnastasiiaPirus/source-code-for-blogs/blob/main/next-navigation-bar/app/components/navigation/navbar/index.tsx

// interface MainNavbarProps {
//   isPro: boolean;
// }

export const MainNavbar = () => {
  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <nav className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center gap-1">
              <Image src={logo} alt="logo" width={40} height={40} />
              <span className="font-bold">SmartyPersona</span>
            </Link>
            <div>
              <Button>
                <Link href="/">
                  <h1 className={cn("font-bold")}>Home</h1>
                </Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href="/faq">
                  <h1 className={cn("font-bold ")}>FAQ</h1>
                </Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href="/aboutus">
                  <h1 className={cn("font-bold ")}>About Us</h1>
                </Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href="/contactus">
                  <h1 className={cn("font-bold")}>Contact Us</h1>
                </Link>
              </Button>
            </div>

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
            </SignedIn>
          </nav>
        </div>
      </div>
    </>
  );
};
