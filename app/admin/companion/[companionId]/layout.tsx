import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import { CompanionNavbar } from "@/components/navbars/companion-navbar";

// import "@/app/globals.css";
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your customized companion.",
};

export default function AdminCompanionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
