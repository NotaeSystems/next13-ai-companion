import { Companion, User, Relationship, Profile } from "@prisma/client";
import prismadb from "@/lib/prismadb";

export async function findRelationship(userId: string, companion: Companion) {
  console.log("inside of findRelationship");
  let relationship = await prismadb.relationship.findFirst({
    where: {
      userId: userId,
      companionId: companion.id,
    },
  });

  if (!relationship) {
    // TODO create relationship  record
    console.log(
      "No relationship with " +
        companion.name +
        " found. Creating new relationship"
    );

    relationship = await prismadb.relationship.create({
      data: {
        userId: userId,
        companionId: companion.id,
        temperature: companion.temperature,
        content: companion.relationship,
        conversations: 1,
      },
    });
  } else {
    console.log("found relationship");

    // must updateMany even though there should only be one record

    console.log(
      "incrementing relationship conversations for " + companion.name
    );
    try {
      const updateRelationship = await prismadb.relationship.updateMany({
        where: {
          userId: userId,
          companionId: companion.id,
        },
        data: {
          conversations: { increment: 1 },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return relationship;
}
