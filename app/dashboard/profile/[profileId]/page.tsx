import { Metadata } from "next";
import Link from "next/link";
import { Profile } from "@prisma/client";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { ProfileForm } from "./components/profile-form";
import Global from "@/Global.js";
import { Debugging } from "@/lib/debugging";

export const metadata: Metadata = {
  title: Global.siteName + " Profile",
};

interface ProfilePageProps {
  params: {
    profileId: string;
  };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  console.log("inside of ProfilePage");
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
    profile = await prismadb.profile.create({
      data: {
        userId: userId,
      },
    });
  }

  return (
    <div>
      <h1 className="text-2xl text-center my-5 ">Your Profile</h1>
      <p className="text-2xl text-center my-5 ">
        Give some information about you so that Persona can better converse with
        you. This information is optional but will make conversations more
        enjoyable.
      </p>
      <ProfileForm Profile={profile} />
    </div>
  );
};

export default ProfilePage;
