import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { auth, redirectToSignIn, SignedOut, SignedIn } from "@clerk/nextjs";
// import { Sparkles } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import Logo from "@/components/navbars/logo";
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
      <div className="w-full h-20 hidden md:flex md:space-x-4 bg-emerald-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <nav className="flex justify-between items-center h-full">
            {/* <Link href="/" className="flex items-center gap-1">
              <Image src={logo} alt="logo" width={40} height={40} />
              <span className="font-bold">SmartyPersona</span>
            </Link> */}
            <Logo />
            <div>
              <Button>
                <Link href="/">Home</Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href="/faq">FAQ</Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href="/aboutus">About Us</Link>
              </Button>
            </div>

            <div>
              <Button>
                <Link href="/contactus">Contact Us</Link>
              </Button>
            </div>

            <SignedOut>
              <div>
                <Button>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>

              <div>
                <Button>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            </SignedOut>

            <SignedIn>
              <div>
                <Button>
                  <Link href="/dashboard">Dashboard</Link>
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
