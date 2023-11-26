// "use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { Companion } from "@prisma/client";
import Image from "next/image";

const font = Poppins({ weight: "600", subsets: ["latin"] });
interface ImagePersonaMediumComponentProps {
  companion: Companion;
}

export const ImagePersonaMediumComponent = ({
  companion,
}: ImagePersonaMediumComponentProps) => {
  return (
    <>
      <div>
        <Image
          src={companion.src}
          className="rounded-xl object-cover"
          alt={companion.name}
          width={100}
          height={100}
        />
      </div>
    </>
  );
};
