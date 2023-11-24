import Image from "next/image";
import Link from "next/link";
import { Companion, Relationship } from "@prisma/client";
import { MessagesSquare } from "lucide-react";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";

//const chatLink = process.env.COMPANION_CHAT_LINK;

interface CompanionsDashboardProps {
  relationships: any;
}

export const RelationshipsDashboard = ({
  relationships,
}: CompanionsDashboardProps) => {
  if (relationships.length === 0) {
    return (
      <div className="pt-10 flex flex-col items-center justify-center space-y-3">
        <div className="relative w-60 h-60">
          <Image fill className="grayscale" src="/empty.png" alt="Empty" />
        </div>
        <p className="text-sm text-muted-foreground">No companions found.</p>
      </div>
    );
  }

  // determine if user is owner

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
      {relationships.map((relationship: any) => (
        <Card
          key={relationship.id}
          className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
        >
          <Link
            // href={`/dashboard/${item.companion.chatLink}/${item.companion.id}`}
            href={`/dashboard/companion/${relationship.companion.id}`}
          >
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <div className="relative w-32 h-32">
                <Image
                  src={relationship.companion.src}
                  fill
                  className="rounded-xl object-cover"
                  alt="Character"
                />
              </div>
              <p className="font-bold">{relationship.companion.name}</p>
              <p className="text-xs">{relationship.companion.description}</p>
              <p> Status: {relationship.companion.status} </p>
            </CardHeader>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <p className="lowercase">@{relationship.companion.userName}</p>

              {/* <div className="flex items-center">
                <MessagesSquare className="w-3 h-3 mr-1" />
                {item._count.messages}
              </div> */}
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};
