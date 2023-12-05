import Global from "@/Global";
import { Metadata } from "next";
// import Image from "next/image";
// import { MainNavbar } from "@/components/navbars/main-navbar";

import { ImageUnderConstructionComponent } from "@/components/image/image-under-construction.";

export const metadata: Metadata = {
  title: Global.siteName + " - About Us",
};

export default function AboutUsPage() {
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
      <h1>About Us</h1>
    </div>
  );
}
