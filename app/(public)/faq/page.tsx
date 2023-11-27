import { Metadata } from "next";
import { ImageUnderConstructionComponent } from "@/components/image/image-under-construction.";
const under_construction = process.env.UNDER_CONSTRUCTION;

export const metadata: Metadata = {
  title: "SmartyPersona-FAQ",
};

export default function FaqPage() {
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
      <h1>FAQ</h1>
    </div>
  );
}
