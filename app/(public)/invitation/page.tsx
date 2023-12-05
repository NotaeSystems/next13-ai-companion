import Global from "@/Global";
import { Metadata } from "next";
import { ImageUnderConstructionComponent } from "@/components/image/image-under-construction.";

export const metadata: Metadata = {
  title: Global.siteName + " Invitation",
};

export default function InvitationPage() {
  if (Global.invitations) {
    return (
      <>
        <div className="h-screen flex items-center justify-center">
          <ImageUnderConstructionComponent height={300} />
        </div>
      </>
    );
  }
  return (
    <div>
      <h1>Invitation</h1>
    </div>
  );
}
