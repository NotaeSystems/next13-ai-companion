import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { Companions } from "@/components/companions";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const data = await prismadb.companion.findMany({
    where: {
      //categoryId: searchParams.categoryId,
      status: "Active",
      public: true,
      // name: {
      //   search: searchParams.name,
      // },
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

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-3xl lg:text-5xl text-center">Home Page</h1>
      <Button>
        <Link href={`/invitation`}>Have an Invitation?</Link>
      </Button>
      {/* <SearchInput /> */}
      {/* <Categories data={categories} /> */}
      <Companions data={data} />
    </div>
  );
};

export default RootPage;
