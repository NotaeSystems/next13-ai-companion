import { Metadata } from "next";
import Link from "next/link";
import { Profile } from "@prisma/client";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const metadata: Metadata = {
  title: "Smarty Persona-Profile",
};

interface ProfilePageProps {
  params: {
    profileId: string;
  };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  let profile: any;

  profile = await prismadb.profile.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!profile) {
    await prismadb.profile.create({
      data: {
        userId: userId,
      },
    });
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <ul>
        <li>
          {profile.firstName} {profile.lastName}{" "}
        </li>
        <li>Gender: {profile.gender}</li>
        <li>Nicknames: {profile.nickNames}</li>
        <li>Email: {profile.email}</li>
        <li>Education Level: {profile.educationLevel}</li>
        <li>Email: {profile.ageLevel}</li>
        <li>Conversations: {profile.conversations}</li>
        <li>ConversationsLimit: {profile.conversationsLimit}</li>
      </ul>
    </div>
  );
};

export default ProfilePage;
