import prismadb from "@/lib/prismadb";
// import { Categories } from "@/components/categories";
import { Companions } from "@/components/companions";
// import { SearchInput } from "@/components/search-input";
// import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
//

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { ImageUnderConstructionComponent } from "@/components/image/image-under-construction.";

const under_construction = process.env.UNDER_CONSTRUCTION;
const invitations = process.env.INVITATIONS;

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const activeCompanions = await prismadb.companion.findMany({
    where: {
      //categoryId: searchParams.categoryId,
      status: "Active",
      adminStatus: "Active",
      publicView: "Yes",
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

  console.log("Public Personas" + activeCompanions);
  const categories = await prismadb.category.findMany();

  if (under_construction === "true") {
    return (
      <>
        <ImageUnderConstructionComponent height={300} />
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
      <Companions companions={activeCompanions} />
    </div>
  );
};

export default RootPage;
