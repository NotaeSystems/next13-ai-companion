import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify, Globe } from "lucide-react";
import Link from "next/link";

const NavigationButtons = () => {
  return (
    <div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <AlignJustify />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                <div className="flex flex-col space-y-4 items-start w-full  text-lg text-white mt-10">
                  <Link href="/" className="">
                    Sign In
                  </Link>
                  <Link href="/" className="">
                    Get Started
                  </Link>
                  <Link href="/pricing" className=" ">
                    Pricing
                  </Link>
                  <Link href="/" className="">
                    Features
                  </Link>
                  <Link href="/contactus" className="">
                    Contact Us
                  </Link>
                  <Link href="/aboutus" className="">
                    About Us
                  </Link>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default NavigationButtons;
