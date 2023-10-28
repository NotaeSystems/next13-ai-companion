import { Metadata } from 'next'
import Link from "next/link";
import { MainNavbar } from "@/components/main-navbar";

export const metadata: Metadata = {
  title: 'Smarty Clone-Contact Us',
}
 
export default function Page() {
  return (
    <div>
      <MainNavbar />
      <h1>Contact Us</h1>
    </div>
  )
}
  