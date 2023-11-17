import prismadb from "@/lib/prismadb";

import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NextResponse } from "next/server";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { AdminNavbar } from "@/components/navbars/admin-navbar";
import { AdminCompanions } from "@/components/admin/admin-companions";

interface InvitationProps {
  searchParams: {
    // categoryId: string;
    // name: string;
  };
}

const InvitationPage = async () => {
  // const categories = await prismadb.category.findMany();
  console.log("inside of invitation");

  return (
    <div className="h-full p-4 space-y-2">
      <h1>Invitation</h1>
    </div>
  );
};

export default InvitationPage;
