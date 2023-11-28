import Note from "./Note";
//import prisma from "@/lib/db/prisma";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs";

import NavBar from "./NavBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OwnerCompanionNavbar } from "@/components/navbars/owner/owner-companion-navbar";
export const metadata: Metadata = {
  title: "SmartyPersona - Notes",
};

interface NotesPageProps {
  params: {
    relationshipId: string;
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  console.log("getting ready to check for relationship");
  const relationship = await prismadb.relationship.findUnique({
    where: {
      id: params.relationshipId,
    },
  });

  if (!relationship) {
    console.log("Relationship Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: relationship.companionId,
    },
  });

  if (!companion) {
    console.log("Persona Not Found. Is user the owner of the Persona?");
    return redirect("/dashboard");
  }

  if (user.id != companion.userId) {
    console.log("User is not the owner of relationship.title");
    return redirect("/dashboard");
  }
  // find all notes belonging to user and companion
  const undefinedField = "";
  const allNotes = await prismadb.note.findMany({
    where: {
      userId: relationship.userId,
      companionId: companion.id,
    },
  });

  console.log(allNotes);
  return (
    <>
      <OwnerCompanionNavbar companion={companion} relationship={relationship} />
      <NavBar companion={companion} relationship={relationship} />
      <Button>
        <Link href={`/owner/${companion.id}/relationship/${relationship.id}`}>
          Edit Relationship
        </Link>
      </Button>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allNotes.map((note) => (
          <Note note={note} key={note.id} />
        ))}
        {allNotes.length === 0 && (
          <div className="col-span-full text-center">
            {
              "You don't have any notes about your relationship yet. Why don't you create one?"
            }
          </div>
        )}
      </div>
    </>
  );
}
