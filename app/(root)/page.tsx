import { Metadata } from 'next'
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { MainNavbar } from "@/components/main-navbar";
import { useProModal } from "@/hooks/use-pro-modal";
const font = Poppins({ weight: "600", subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Smarty Clone',
}
 
export default function Page() {
  return (
    <div>
      <MainNavbar />
        
     <div className="gap-18">
        <h1>
          Root Landing Page
        </h1>  
      </div>
      
    </div>
  )
}