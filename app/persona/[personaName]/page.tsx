import Global from "@/Global.js";
import { Debugging } from "@/lib/debugging";
import prismadb from "@/lib/prismadb";
// import { Categories } from "@/components/categories";
//import { Companions } from "@/components/companions";
// import { SearchInput } from "@/components/search-input";
// import { MainNavbar } from "@/components/navbars/main-navbar";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePersonaComponent } from "@/components/image/image-persona";

import { ImageUnderConstructionComponent } from "@/components/image/image-under-construction.";

export const metadata: Metadata = {
  title: Global.siteName,
};

const underConstruction: boolean = Global.underConstruction;

interface PersonaNameRootPageProps {
  params: {
    personaName: string;
  };
}

const PersonaRootPage = async ({ params }: PersonaNameRootPageProps) => {
  // lets find the Persona who are public
  const persona = await prismadb.companion.findFirst({
    where: {
      namespace: params.personaName,
      status: "Active",
      adminStatus: "Active",
      publicView: "Yes",
    },
  });

  if (!persona) {
    return "Error: Cannot find Persona";
  }
  Debugging("Debugging: Persona: " + persona.name);

  if (underConstruction) {
    return (
      <>
        <ImageUnderConstructionComponent height={300} />
      </>
    );
  }

  return (
    <>
      <div className="p-4 space-y-2">
        <h1>{persona.name}</h1>
        <div className="grid text-2xl font-bold items-center justify-center m-3">
          <Button>
            <Link href={`/invitation`}>Have an Invitation?</Link>
          </Button>
          <div>
            <Link href={`/dashboard/companion/${persona.id}`}>
              <ImagePersonaComponent companion={persona} height={300} />
            </Link>
          </div>
          <div>{persona.description}</div>
        </div>
      </div>
    </>
  );
};

export default PersonaRootPage;
