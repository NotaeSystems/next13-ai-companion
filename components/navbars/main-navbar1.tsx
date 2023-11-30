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
import { NavigationMenuBar } from "@/components/navbars/navigation-menu-bar";
// import { useProModal } from "@/hooks/use-pro-modal";

const font = Poppins({ weight: "600", subsets: ["latin"] });

// https://github.com/AnastasiiaPirus/source-code-for-blogs/blob/main/next-navigation-bar/app/components/navigation/navbar/index.tsx

// interface MainNavbarProps {
//   isPro: boolean;
// }

export const MainNavbar1 = () => {
  return (
    <>
      <NavigationMenuBar />
    </>
  );
};
