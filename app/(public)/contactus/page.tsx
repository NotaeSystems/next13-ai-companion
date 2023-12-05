import Global from "@/Global";
import { Metadata } from "next";
import { ImageUnderConstructionComponent } from "@/components/image/image-under-construction.";

export const metadata: Metadata = {
  title: Global.siteName + " Contact Us",
};

export default function ContactUsPage() {
  if (Global.underConstruction) {
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
      <h1>Contact Us</h1>
    </div>
  );
}
