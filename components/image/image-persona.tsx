// "use client";

import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

import { Companion } from "@prisma/client";
import Image from "next/image";

const font = Poppins({ weight: "600", subsets: ["latin"] });
interface ImagePersonaComponentProps {
  companion: Companion;

  height: number;
}

export const ImagePersonaComponent = ({
  companion,
  // width,
  height,
}: ImagePersonaComponentProps) => {
  return (
    <>
      <div>
        <Image
          src={companion.src}
          className="rounded-xl object-cover"
          alt={companion.name}
          width={height}
          height={height}
        />
      </div>
    </>
  );
};
