import React from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain } from "lucide-react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { cn } from "@/lib/utils";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 z-50 flex w-[92%] max-w-6xl -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-blur-lg backdrop-blur-md px-4 py-3 shadow-2xl transition-all duration-300">
      <Link
        href="/"
        className={cn(bricolage.className, "flex items-center gap-1.5 text-[1.1rem] font-bold text-white transition-opacity hover:opacity-80")}
      >
        <Image src="/icon.png" alt="Logo" width={100} height={100} className="size-8 text-primary" />
        MindScript AI
      </Link>

      <div className="flex items-center gap-2 md:gap-8">
        <div className="hidden md:flex items-center gap-6 text-[0.95rem] font-medium text-neutral-400 mr-2">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
