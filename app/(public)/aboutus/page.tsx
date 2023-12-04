import { Metadata } from "next";
// import Image from "next/image";
// import { MainNavbar } from "@/components/navbars/main-navbar";

export const metadata: Metadata = {
  title: "SmartyPersona - About Us",
};

import { ImageUnderConstructionComponent } from "@/components/image/image-under-construction.";

const under_construction = process.env.UNDER_CONSTRUCTION;

export default function AboutUsPage() {
  if (under_construction === "true") {
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
