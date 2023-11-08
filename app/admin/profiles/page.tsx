import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { CompanionsDashboard } from "@/components/companions-dashboard";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { AdminProfiles } from "@/components/admin/admin-profiles";
interface ProfilesAdminPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const ProfilesAdminPage = async ({ searchParams }: ProfilesAdminPageProps) => {
  const categories = await prismadb.category.findMany();
  const { userId } = auth();
  console.log(userId);
  if (!userId) {
    return redirectToSignIn();
  }

  const profiles = await prismadb.profile.findMany({});

  const data: any = profiles;
  return (
    <div className="h-full p-4 space-y-2">
      <h1>User Profiles</h1>
      <AdminProfiles data={profiles} />
      // <h2>Under Construction</h2>
    </div>
  );
};

export default ProfilesAdminPage;
