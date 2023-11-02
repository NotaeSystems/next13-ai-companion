import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { Companions } from "@/components/companions";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/main-navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const data = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  const categories = await prismadb.category.findMany();
  const { userId } = auth();
  console.log(userId);
  if (!userId) {
    return redirectToSignIn();
  }
  return (
    <div className="h-full p-4 space-y-2">
      <Link href="/dashboard/profile/{userId}">Profile- {userId}</Link>

      {/* <SearchInput /> */}
      {/* <Categories data={categories} /> */}
      <Companions data={data} />
    </div>
  );
};

export default RootPage;
