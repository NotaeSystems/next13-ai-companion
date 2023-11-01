import { Companion, User, Relationship } from "@prisma/client";
import prismadb from "@/lib/prismadb";

export async function findRelationship(userId:string, companion:Companion) {

    console.log("inside of findRelationship")
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
            content: companion.relationship
          },
        });
      } else {
        console.log("found relationship");
      }

    return relationship
  }