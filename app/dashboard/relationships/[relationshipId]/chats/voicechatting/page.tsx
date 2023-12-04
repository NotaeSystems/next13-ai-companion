import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";
//import Image from 'next/image'
import { Chat } from "@/components/voicechatting/chat";
import prismadb from "@/lib/prismadb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CompanionNavbar } from "@/components/navbars/companion-navbar";
import { isAdmin } from "@/lib/admin/isAdmin";
import { OwnerCompanionNavbar } from "@/components/navbars/owner/owner-companion-navbar";
import { ImagePersonaLargeComponent } from "@/components/image/image-persona-large";
import { nanoid } from "@/lib/utils";

interface VoiceChattingPageProps {
  params: {
    relationshipId: string;
  };
}
const id = nanoid();
console.log("Random Chat Id: " + id);

const VoiceChattingPage = async ({ params }: VoiceChattingPageProps) => {
  try {
    console.log(
      "made it to /dashboard/relationships/[relationshipId]/chats/voicechatting"
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
    // find out if user is admin
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

    // this means the user has been suspended by Admin
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
        {/* Send Owner Companion Navbar if User is Owner of Persona if not 
        then send Regular Companion Bar */}
        {companion.userId === relationship.userId ? (
          <OwnerCompanionNavbar
            companion={companion}
            relationship={relationship}
          />
        ) : (
          <CompanionNavbar companion={companion} relationship={relationship} />
        )}

        <div className="flex items-center justify-center mt-6">
          <Button>
            <Link href={`/dashboard/relationships/${relationship.id}`}>
              <h1>{relationship.title}</h1>
            </Link>
          </Button>
        </div>

        <Chat id={id} companion={companion} relationship={relationship}></Chat>
      </>
    );
  } catch (err) {
    return redirect("/server-error");
  }
};

export default VoiceChattingPage;
