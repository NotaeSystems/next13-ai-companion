import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
//import { ProModal } from '@/components/pro-modal';
import { MainNavbar } from "@/components/navbars/main-navbar";

//***********BUG**************
// when globals.css is loaded here a hard refresh will lose css
// at this time moved globals.css to MainNavbar
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Companion.AI",
  description: "Your customized companion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={cn("bg-secondary", inter.className)}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <MainNavbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
