import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import { ClerkProvider } from "@clerk/nextjs";
import { AdminNavbar } from "@/components/navbars/admin-navbar";
// import { cn } from "@/lib/utils";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Toaster } from "@/components/ui/toaster";
//import { ProModal } from '@/components/pro-modal';
// import { MainNavbar } from "@/components/navbars/main-navbar";
import { auth, redirectToSignIn } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
// import "../globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Companion.AI",
  description: "Your customized companion.",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("inside of admin");
  const { userId } = auth();
  console.log(userId);

  if (!userId) {
    return redirectToSignIn();
  }

  let profile = null;
  profile = await prismadb.profile.findFirst({
    where: { userId: userId, role: "Admin" },
  });

  console.log("getting ready to check if admin");
  if (!profile) {
    console.log("Sending to NextResponse. Not Admin");
    return <>Not Authorize</>;
  }
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}
