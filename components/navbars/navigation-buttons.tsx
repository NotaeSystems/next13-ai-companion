import { Button } from "@/components/ui/button";
import {
  auth,
  redirectToSignIn,
  SignedOut,
  SignOutButton,
  SignedIn,
} from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetClose,
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
          <SheetTrigger asChild>
            <AlignJustify />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetDescription>
                <div className="flex flex-col space-y-4 items-start w-full  text-lg text-white mt-10">
                  <SignedOut>
                    <Link href="/sign-in">
                      <h1 className={cn("font-bold ")}>Sign In</h1>
                    </Link>

                    <Link href="/sign-up">
                      <h1 className={cn("font-bold ")}>Sign Up</h1>
                    </Link>
                  </SignedOut>

                  <SignedIn>
                    {/* <SheetClose asChild>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          baseTheme: shadesOfPurple,
                        }}
                      />
                    </SheetClose> */}

                    <SheetClose asChild>
                      <Link href="/profile">
                        <h1 className={cn("font-bold")}>Profile</h1>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <SignOutButton />
                    </SheetClose>

                    <SheetClose asChild>
                      <Link href="/dashboard">
                        <h1 className={cn("font-bold")}>Dashboard</h1>
                      </Link>
                    </SheetClose>
                  </SignedIn>

                  <SheetClose asChild>
                    <Link href="/" className="">
                      Home
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link href="/faq" className="">
                      FAQ
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link href="/pricing" className=" ">
                      Pricing
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link href="/" className="">
                      Features
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link href="/contactus" className="">
                      Contact Us
                    </Link>
                  </SheetClose>
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
