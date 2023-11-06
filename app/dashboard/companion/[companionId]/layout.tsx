import type { Metadata } from "next";
import { Inter } from "next/font/google";
//import { ClerkProvider } from "@clerk/nextjs";

//import { cn } from "@/lib/utils";
//import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
////import { ProModal } from "@/components/pro-modal";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";

import "@/app/globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your customized companion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
