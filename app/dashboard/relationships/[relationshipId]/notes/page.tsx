import Note from "@/components/Note";
//import prisma from "@/lib/db/prisma";
import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";
import NavBar from "./NavBar";
import { useSearchParams } from "next/navigation";
import { TopicsPanel } from "@/components/topics-panel";
export const metadata: Metadata = {
  title: "SmartyPersona - Notes",
};

interface NotesPageProps {
  params: {
    relationshipId: string;
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  // check to see if relationship exists
  let relationship = null;
  relationship = await prismadb.relationship.findUnique({
    where: {
      id: params.relationshipId,
    },
  });
  if (!relationship) {
    console.log("Did not find relationship");
    return (
      <>
        <h1>Did not find Relationship</h1>
      </>
    );
  }

  // let profileName = null;

  const companion = await prismadb.companion.findUnique({
    where: {
      id: relationship.companionId,
    },
  });

  if (!companion) {
    console.log("companion Not Found. Is user the owner of the companion?");
    return redirect("/dashboard");
  }

  // // check to see if relationship exists
  // let relationship = null;
  // relationship = await prismadb.relationship.findFirst({
  //   where: {
  //     companionId: companion.id,
  //     userId: userId,
  //   },
  // });

  // let profileName = null;

  //const searchParams = useSearchParams()

  //const topicId = searchParams.get('topicId')

  // const topics = await prismadb.topic.findMany();

  // find all personal relationship notes belonging to user and companion
  const allNotes = await prismadb.note.findMany({
    where: {
      userId: relationship.userId,
      companionId: companion.id,
      //topicId: topicId,
    },
  });
  return (
    <>
      <CompanionNavbar companion={companion} relationship={relationship} />
      <p className="text-xl text-center my-5 ">
        Add Notes about your relationship with the Persona {companion.name}
      </p>
      <p>
        Refer to yourself and Persona in the third person, ie {companion.name}.
        The Persona will now know these facts.
      </p>
      <NavBar companion={companion} />
      {/* <TopicsPanel topics={topics} /> */}
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
