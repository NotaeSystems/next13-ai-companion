import Image from "next/image";
import Link from "next/link";
import { Companion, Relationship } from "@prisma/client";
import { MessagesSquare } from "lucide-react";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { ImagePersonaLargeComponent } from "../image/image-persona-large";

//const chatLink = process.env.COMPANION_CHAT_LINK;

interface CompanionsProps {
  data: any;
}

export const AdminCompanions = ({ data }: CompanionsProps) => {
  if (data.length === 0) {
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
      {data.map((item: any) => (
        <Card
          key={item.id}
          className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
        >
          <Link href={`/admin/companion/${item.id}`}>
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <div className="relative w-32 h-32">
                <ImagePersonaLargeComponent companion={item} />
                {/* <Image
                  src={item.src}
                  fill
                  className="rounded-xl object-cover"
                  alt="Character"
                /> */}
              </div>
              <p className="font-bold">{item.name}</p>
              <p className="text-xs">{item.description}</p>
              <p> Status: {item.status} </p>
              <p> Public: {item.public} </p>
            </CardHeader>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <p className="lowercase">@{item.userName}</p>

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
