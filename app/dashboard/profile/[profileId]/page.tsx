import { Metadata } from "next";
import Link from "next/link";
import { Profile } from "@prisma/client";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { ProfileForm } from "./components/profile-form";

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
      <p className="max-w-prose text-center gap-5">
        Give some information about you so that your Persona can better converse
        with you.
      </p>
      <ProfileForm Profile={profile} />
    </div>
  );
};

export default ProfilePage;
