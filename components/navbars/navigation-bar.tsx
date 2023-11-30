"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/navbars/logo";
import { NavigationMenuBar } from "@/components/navbars/navigation-menu-bar";
import NavigationButtons from "@/components/navbars/navigation-buttons";

const NavigationBar = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarClasses = `
    flex items-center justify-center space-x-10 bg-green-300 md:px-10
    sticky top-0 z-50 ${hasScrolled ? "shadow-sm" : ""}
  `;

  return (
    <div className={navbarClasses}>
      <div className="flex w-2/3 md:w-1/2">
        <Logo />
        <NavigationMenuBar />
      </div>
      <NavigationButtons />
    </div>
  );
};

export default NavigationBar;
