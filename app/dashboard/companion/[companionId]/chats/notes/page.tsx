import Note from "@/components/Note";
//import prisma from "@/lib/db/prisma";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";
import NavBar from "./NavBar";
export const metadata: Metadata = {
  title: "FlowBrain - Notes",
};

interface NotesPageProps {
  params: {
    companionId: string;
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  // find all notes belonging to Companion and User.These are relationship notes.
  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      userId,
    },
  });

  if (!companion) {
    console.log("companion Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }

  const relationship = await prismadb.relationship.findUnique({
    where: {
      id: params.companionId,
      userId,
    },
  });

  if (!relationship) {
    console.log("companion Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }
  // find all personal relationship notes belonging to user and companion
  const allNotes = await prismadb.note.findMany({
    where: { userId, companionId: params.companionId },
  });

  return (
    <>
      <CompanionNavbar companion={companion} relationship={relationship} />
      <NavBar companion={companion} relationship={relationship} />
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
