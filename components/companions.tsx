import Image from "next/image";
import Link from "next/link";
import { Companion } from "@prisma/client";
import { MessagesSquare } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ImagePersonaComponent } from "./image/image-persona";
import { ScrollArea } from "@/components/ui/scroll-area";
//const chatLink = process.env.COMPANION_CHAT_LINK;

interface CompanionsProps {
  companions: (Companion & {
    _count: {
      messages: number;
    };
  })[];
}

export const Companions = ({ companions }: CompanionsProps) => {
  if (companions.length === 0) {
    return (
      <div className="pt-10 flex flex-col items-center justify-center space-y-3">
        <p className="text-lg font-bold d">No Personas found.</p>
        <div className="relative w-60 h-60">
          <Image fill className="grayscale" src="/empty.png" alt="Empty" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
      {companions.map((companion) => (
        <Card
          key={companion.name}
          className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0 h-200"
        >
          <Link href={`/dashboard/companion/${companion.id}`}>
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <div className="relative">
                <ImagePersonaComponent companion={companion} height={150} />
              </div>
              <p className="font-bold">{companion.name}</p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <p className="text-s">{companion.description}</p>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <p className="lowercase">@{companion.userName}</p>
              <div className="flex items-center">
                <MessagesSquare className="w-3 h-3 mr-1" />
                {companion._count.messages}
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};
