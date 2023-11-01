import { Metadata } from 'next'
import Link from "next/link";
import { MainNavbar } from "@/components/main-navbar";
export const metadata: Metadata = {
  title: 'Smarty Persona-Profile',
}
 
export default function Profile() {
  return (
    
    <div>
      <MainNavbar />

      <h1>Profile Page</h1>
      
    </div>
  )
}
  