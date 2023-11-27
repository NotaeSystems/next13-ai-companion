import Note from "./Note";
//import prisma from "@/lib/db/prisma";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs";

import NavBar from "./NavBar";
import { OwnerCompanionNavbar } from "@/components/navbars/owner/owner-companion-navbar";
export const metadata: Metadata = {
  title: "SmartyPersona - Notes",
};

interface NotesPageProps {
  params: {
    companionId: string;
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
    },
  });

  if (!companion) {
    console.log("companion Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }
  console.log("getting ready to check for relationship");
  const relationship = await prismadb.relationship.findFirst({
    where: {
      companionId: companion.id,
      userId: userId,
    },
  });
  if (!relationship) {
    console.log("Relationship Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }
  if (user.id != companion.userId) {
    console.log("user is not the owner");
    return redirect("/dashboard");
  }
  // find all personal relationship notes belonging to user and companion
  const undefinedField = "";
  const allNotes = await prismadb.note.findMany({
    where: {
      userId: null,
      companionId: companion.id,
    },
  });

  console.log(allNotes);
  return (
    <>
      <OwnerCompanionNavbar companion={companion} relationship={relationship} />
      <NavBar companion={companion} />
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
