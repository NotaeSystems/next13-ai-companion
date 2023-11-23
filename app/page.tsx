import prisma from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { Companions } from "@/components/companions";
import { SearchInput } from "@/components/search-input";
import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import UnderConstruction from "@/components/under-construction";
const under_construction = process.env.UNDER_CONSTRUCTION;

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  if (under_construction === "true") {
    return (
      <>
        <UnderConstruction />
      </>
    );
  }
  const data = await prisma.companion.findMany({
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

  const categories = await prisma.category.findMany();

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
