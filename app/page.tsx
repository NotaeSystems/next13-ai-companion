import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { Companions } from "@/components/companions";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const under_construction = process.env.UNDER_CONSTRUCTION;

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
      updatedAt: "desc",
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

  if (under_construction === "True") {
    return (
      <>
        <div className="h-screen flex items-center justify-center">
          <Image
            src="/under-construction.jpg"
            alt="Under Construction"
            height={300}
            width={300}
          />
        </div>
      </>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <h1>Home Page</h1>
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
