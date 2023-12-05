import Global from "@/Global.js";
import { Debugging } from "@/lib/debugging";
import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { CompanionsDashboard } from "@/components/companions-dashboard";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AdminCompanionNavbar } from "@/components/navbars/admin-companion-navbar";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

const CompanionPage = async ({ params }: CompanionIdPageProps) => {
  const { userId } = auth();
  Debugging(`${userId}`);
  if (!userId) {
    return redirectToSignIn();
  }

  let companion = null;

  companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
    },
  });

  if (!companion) {
    Debugging("Returning there is no companion found");
    return redirect("/admin");
  }

  return (
    <>
      <div className="h-full p-4 space-y-2">
        <AdminCompanionNavbar companion={companion} />
        <h1 className="text-xl text-center my-5 ">Persona: {companion.name}</h1>
        <div className="flex items-center justify-center">
          <Image
            src={companion.src}
            className="rounded-xl object-cover"
            alt="Persona ${companion.name}"
            height={150}
            width={150}
          />
        </div>
        <p className="text-xl text-center my-5 ">{companion.description}</p>
      </div>
    </>
  );
};

export default CompanionPage;
