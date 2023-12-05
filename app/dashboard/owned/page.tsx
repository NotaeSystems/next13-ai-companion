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
import { auth, redirectToSignIn } from "@clerk/nextjs";
const under_construction = process.env.UNDER_CONSTRUCTION;

interface DashboardOwnedPageProps {
  // searchParams: {
  //   categoryId: string;
  //   name: string;
}

const DashboardOwnedPage = async ({}: DashboardOwnedPageProps) => {
  const { userId } = auth();
  console.log(userId);
  if (!userId) {
    return redirectToSignIn();
  }

  const ownedCompanions = await prismadb.companion.findMany({
    where: {
      //categoryId: searchParams.categoryId,
      userId: userId,

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

  console.log("Owned Personas" + ownedCompanions);
  const categories = await prismadb.category.findMany();

  if (under_construction === "true") {
    return (
      <>
        <div className="h-screen flex items-center justify-center">
          <ImageUnderConstructionComponent height={300} />
          {/* <Image
            src="/under-construction.jpg"
            alt="Under Construction"
            height={300}
            width={300}
          /> */}
        </div>
      </>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <h1>Your Owned Personas</h1>
      {/* <Button>
        <Link href={`/invitation`}>Have an Invitation?</Link>
      </Button> */}
      {/* <SearchInput /> */}
      {/* <Categories data={categories} /> */}
      <Companions companions={ownedCompanions} />
    </div>
  );
};

export default DashboardOwnedPage;
