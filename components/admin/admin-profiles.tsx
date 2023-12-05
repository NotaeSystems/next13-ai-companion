import Global from "@/Global.js";
import { Debugging } from "@/lib/debugging";
import Image from "next/image";
import Link from "next/link";
import { Profile, Companion, Relationship } from "@prisma/client";
import { MessagesSquare } from "lucide-react";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";

//const chatLink = process.env.COMPANION_CHAT_LINK;

interface ProfilesProps {
  data: any;
}

export const AdminProfiles = ({ data }: ProfilesProps) => {
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
      {data.map((profile: any) => (
        <Card
          key={profile.id}
          className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
        >
          <Link href={`/admin/profile/${profile.id}/edit`}>
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <div className="relative w-32 h-32">
                {/* <Image
                  src={item.src}
                  fill
                  className="rounded-xl object-cover"
                  alt="Character"
                /> */}
              </div>
              <p className="font-bold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="lowercase">@{profile.role}</p>
              <p className="text-xs">{profile.description}</p>
              <p> Status: {profile.status} </p>
              <p> Nick Names: {profile.nickNames} </p>
              <p> Email: {profile.email} </p>
              <p> Gender: {profile.gender} </p>
              <p> Age Level: {profile.ageLevel} </p>
              <p> Education Level: {profile.educationLevel} </p>
              <p> Conversations: {profile.conversations} </p>
              <p> Conversations Limit: {profile.conversationsLimit} </p>
            </CardHeader>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
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
