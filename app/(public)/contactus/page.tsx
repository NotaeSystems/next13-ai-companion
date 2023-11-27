import { Metadata } from "next";
import { ImageUnderConstructionComponent } from "@/components/image/image-under-construction.";

const under_construction = process.env.UNDER_CONSTRUCTION;

export const metadata: Metadata = {
  title: "Smarty Clone-Contact Us",
};

export default function ContactUsPage() {
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
      <h1>Contact Us</h1>
    </div>
  );
}
