import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { ProfileForm } from "./components/profile-form";
// import { CompanionForm } from "@/components/companion-form";
import { AdminProfileNavbar } from "@/components/navbars/admin-profile-navbar";
interface EditProfileAdminPageProps {
  params: {
    profileId: string;
  };
}
console.log("paramsId: ");
const EditProfileAdminPage = async ({ params }: EditProfileAdminPageProps) => {
  const { userId } = auth();
  console.log("inside of EditProfileAdminPage");

  if (!userId) {
    return redirectToSignIn();
  }

  // const validSubscription = await checkSubscription();

  // if (!validSubscription) {
  //   return redirect("/");
  // }
  console.log("params.profileId: " + params.profileId);
  let profile = null;

  profile = await prismadb.profile.findUnique({
    where: {
      id: params.profileId,
    },
  });

  if (!profile) {
    console.log("Profile Not Found");
    return redirect("/dashboard");
  }
  const profileFullname = profile.firstName + " " + profile.lastName;
  // const categories = await prismadb.category.findMany();

  // console.log("getting ready to return");
  return (
    <>
      <AdminProfileNavbar profile={profile}></AdminProfileNavbar>
      <h1>{profileFullname}</h1>
      <h1> Edit Profile </h1>
      <ProfileForm Profile={profile} />
      {/* <ProfileForm initialData={profile} } /> */}
    </>
  );
};

export default EditProfileAdminPage;
