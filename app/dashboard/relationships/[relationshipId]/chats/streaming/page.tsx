// /dashboard/streaming/[chatid]
// streams elevenlabs voice back

import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";
//import Image from 'next/image'
import ChatComponent from "./components/chatComponent";
//import {StreamingAudioPlayerComponent} from './components/streamingAudioPlayerComponent'
import prismadb from "@/lib/prismadb";
import { MainNavbar } from "@/components/navbars/main-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";
import { isAdmin } from "@/lib/admin/isAdmin";
// export default function Home() {

//   // ChatComponent ? Why make a new component?
//   // ChatComponent -> client, text inputs -> onChange -> we need to make a client side component

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="bg-slate-800 p-3 w-[800px] rounded-md text-white">
//         <h2 className="text-2xl">GPT-4 Streaming Chat Application</h2>
//         <ChatComponent />
//       </div>
//     </main>
//   )
// }

interface DashboardRelationshipsChatsStreamingPageProps {
  params: {
    relationshipId: string;
  };
}

const DashboardRelationshipsChatsStreamingPage = async ({
  params,
}: DashboardRelationshipsChatsStreamingPageProps) => {
  try {
    console.log(
      "made it to /dashboard/relationships/[relationshipId]/chats/streaming"
    );
    const { userId } = auth();

    if (!userId) {
      return redirectToSignIn();
    }

    // check to see if relationship exists
    let relationship = null;
    relationship = await prismadb.relationship.findUnique({
      where: {
        id: params.relationshipId,
      },
    });

    // const companionId = companion.id;
    if (!relationship) {
      return (
        <>
          <div className="text-xl text-red-500 col-span-full text-center">
            {"That Relationship cannot be found."}
          </div>
        </>
      );
    }

    // does user have rights to converse with this companion
    let userIsAdmin = await isAdmin(userId);
    if (userId != relationship.userId && !userIsAdmin) {
      return (
        <div className="text-xl text-red-500 col-span-full text-center">
          {"That Chat is not available for you."}
        </div>
      );
    }

    const companion = await prismadb.companion.findUnique({
      where: {
        id: relationship.companionId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          where: {
            userId,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    if (!companion) {
      return (
        <>
          <div className="text-xl text-red-500 col-span-full text-center">
            {"There is not a Companion with that ID available."}
          </div>
        </>
      );
    }

    if (relationship.adminStatus === "Suspended") {
      return (
        <>
          <div className="text-xl text-red-500 col-span-full text-center">
            {"Relationship has been suspended"}
          </div>
        </>
      );
    }

    return (
      <>
        <CompanionNavbar companion={companion} relationship={relationship} />
        {/* <main className="flex min-h-screen flex-col items-center justify-between p-24"> */}
        <main className="flex flex-col h-full p-24 space-y-2 items-center ">
          <div className="bg-slate-800 p-3  rounded-md  text-white">
            <div className="flex justify-center col-auto">
              <h2 className="text-2xl">{companion.name}</h2>
            </div>
            <div className="flex justify-center col-auto">
              <Link href={`/dashboard/companion/${companion.id}`}>
                <Image
                  src={companion.src}
                  className="rounded-xl object-cover"
                  alt="Character"
                  width={50}
                  height={50}
                />
              </Link>
            </div>

            {/* <Button>
            <Link href={`/dashboard/companion/${companionId}/relationship`}>
              Relationship
            </Link>
          </Button> */}

            <ChatComponent companion={companion} relationship={relationship} />
          </div>
        </main>
      </>
    );
  } catch (err) {
    return redirect("/server-error");
  }
};

export default DashboardRelationshipsChatsStreamingPage;
