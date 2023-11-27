// "use client";

import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

import { Companion } from "@prisma/client";
import Image from "next/image";

const font = Poppins({ weight: "600", subsets: ["latin"] });
interface ImageUnderConstructionComponentProps {
  height: number;
}

export const ImageUnderConstructionComponent = ({
  height,
}: ImageUnderConstructionComponentProps) => {
  return (
    <>
      <div className={`relative}`}>
        <Image
          src="/under-construction.jpg"
          className="rounded-xl object-cover"
          alt="Under Construction"
          // fill
          width={height}
          height={height}
        />
      </div>
    </>
  );
};
