// /dashboard/streaming/[chatid]
// streams elevenlabs voice back

import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";
//import Image from 'next/image'
import ChatComponent from "./components/chatComponent";
//import {StreamingAudioPlayerComponent} from './components/streamingAudioPlayerComponent'
import prismadb from "@/lib/prismadb";
import { MainNavbar } from "@/components/main-navbar";
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

interface StreamingPageProps {
  params: {
    chatid: string;
  };
}

const StreamingPage = async ({ params }: StreamingPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatid,
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
    return redirect("/dashboard");
  }

  
  return (
    <>
      <MainNavbar />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-slate-800 p-3 w-[800px] rounded-md text-white">
          <h2 className="text-2xl">{companion.name}</h2>

          <ChatComponent companion={companion} />
        </div>
      </main>
    </>
  );
};

export default StreamingPage;
