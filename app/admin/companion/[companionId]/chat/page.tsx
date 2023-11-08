import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { CompanionsDashboard } from "@/components/companions-dashboard";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AdminCompanionNavbar } from "@/components/navbars/admin-companion-navbar";

interface ChatAdminPageProps {
  params: {
    companionId: string;
  };
}

const CompanionPage = async ({ params }: ChatAdminPageProps) => {
  const { userId } = auth();
  console.log(userId);
  if (!userId) {
    return redirectToSignIn();
  }

  let companion = null;

  companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      userId,
    },
  });

  if (!companion) {
    return redirect("/admin");
  }

  return (
    <>
      <div className="h-full p-4 space-y-2">
        <AdminCompanionNavbar companion={companion} />
        <h1>Chat with {companion.name}</h1>
        <h2>Under Construction</h2>
      </div>
    </>
  );
};

export default CompanionPage;
