// "use client";

import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

import { Companion } from "@prisma/client";
import Image from "next/image";

const font = Poppins({ weight: "600", subsets: ["latin"] });
interface ImagePersonaSmallComponentProps {
  companion: Companion;
}

export const ImagePersonaSmallComponent = ({
  companion,
}: ImagePersonaSmallComponentProps) => {
  return (
    <>
      <div>
        <Image
          src={companion.src}
          className="rounded-xl object-cover"
          alt={companion.name}
          width={50}
          height={50}
        />
      </div>
    </>
  );
};
