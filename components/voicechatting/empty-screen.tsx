import { UseChatHelpers } from "ai/react";
import { ImagePersonaLargeComponent } from "@/components/image/image-persona-large";
import Image from "next/image";
import Link from "next/link";
import jasonPhoto from "public/jason-icon.png";
import { Companion, Relationship } from "@prisma/client";

const exampleMessages = [
  {
    heading: "Explain technical concepts",
    message: `What is a "serverless function"?`,
  },
  {
    heading: "Summarize an article",
    message: "Summarize the following article for a 2nd grader: \n",
  },
  {
    heading: "Draft an email",
    message: `Draft an email to my boss about the following: \n`,
  },
];

export interface EmptyScreenProps {
  companion: Companion;
  // relationship: Relationship;
}

export function EmptyScreen({ companion }: EmptyScreenProps) {
  return (
    <>
      <div className="mx-auto max-w-2xl px-4">
        <div className="grid rounded-lg border bg-background p-8 items-center justify-center">
          <div>
            <h1 className="mb-2 text-lg font-semibold">
              Welcome to Voice Chatting!
            </h1>
          </div>
          <div>
            <Link href={`/dashboard/companion/${companion.id}`}>
              <ImagePersonaLargeComponent companion={companion} />
            </Link>
          </div>
        </div>
        {/* <p className="mb-2 leading-normal text-muted-foreground">
          Welcome to VoiceChatting
        </p> */}

        {/* <Button>
                <Link href={`/dashboard/relationships/${relationship.id}`}>
                  Your Relationship
                </Link>
              </Button> */}
        {/*<p className="leading-normal text-muted-foreground">*/}
        {/*    */}
        {/*</p>*/}
        {/* </div> */}
      </div>
    </>
  );
}
