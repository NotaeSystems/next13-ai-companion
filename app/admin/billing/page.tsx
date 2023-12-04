import prismadb from "@/lib/prismadb";
import { ImageUnderConstructionComponent } from "@/components/image/image-under-construction.";
const BillingAdminPage = async () => {
  const under_construction = process.env.UNDER_CONSTRUCTION;

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
    <div className="h-full p-4 space-y-2">
      <h1>Billing</h1>
      <h2>Under Construction</h2>
    </div>
  );
};

export default BillingAdminPage;
