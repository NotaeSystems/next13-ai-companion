import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { MainNavbar } from "@/components/main-navbar";
import { Hero } from "@/components/home-page/hero";
import { Header } from "@/components/home-page/header";
import { Footer } from "@/components/home-page/footer";

import { useProModal } from "@/hooks/use-pro-modal";

const font = Poppins({ weight: "600", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smarty Persona - Home page",
};

export default function Page() {
  return (
    <div>
      <h1>Coming Soon!</h1>
      {/* <Header />
      <Hero />
      <Footer /> */}
    </div>
  );
}
