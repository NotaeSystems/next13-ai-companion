"use client";

import logo from "@/assets/logo.png";
import AIChatButton from "@/components/AIChatButton";
import AddEditNoteDialog from "./AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Plus } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Companion } from "@prisma/client";

interface NavBarProps {
  companion: Companion;
}

export default function NavBar({ companion }: NavBarProps) {
  const { theme } = useTheme();

  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  return (
    <>
      <div className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          {/* <Link href="/notes" className="flex items-center gap-1">
            <Image src={logo} alt="FlowBrain logo" width={40} height={40} />
            <span className="font-bold">FlowBrain</span>
          </Link> */}
          <div>
            <h1 className="">Notes</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <ThemeToggleButton /> */}
            <Button onClick={() => setShowAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Companion Note
            </Button>
            <AIChatButton />
          </div>
        </div>
      </div>
      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        companion={companion}
      />
    </>
  );
}
