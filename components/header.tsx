"use client";
import { useStoreUser } from "@/hooks/useStoreUser";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
const Header = () => {
  const { isLoading, isAuthenticated } = useStoreUser();
  const path = usePathname();

  if(path.includes("/dashboard")) return null;

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div className="backdrop-blur-md bg-white/20 border-white/20 rounded-full px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center gap-2">
        <Link href={isAuthenticated ? "/feed" : "/"} className="shrink-0">
          <Image
            src="/logo.png"
            alt="Muse Logo"
            width={96}
            height={32}
            className=" h-14 sm:h-16 w-auto object-contain"
          />
        </Link>

        {path === "/" && (
          <div className={"hidden lg:flex space-x-6  flex-1 justify-center"}>
            <Link
              href="#features"
              className="text-white font-medium transition-all duration-300 hover:text-purple-300 cursor-pointer"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-white font-medium transition-all duration-300 hover:text-purple-300 cursor-pointer"
            >
              Testimonials
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Authenticated>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Dashboard</span>
              </Button>
            </Link>
            <UserButton />
          </Authenticated>

          <Unauthenticated>
            <SignInButton>
              <Button variant={"ghost"} size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="primary" size="sm" className="whitespcae-nowrap">
                Get Started
              </Button>
            </SignUpButton>
          </Unauthenticated>
        </div>

        {isLoading && (
          <div className="fixed bottom-0 left-8 w-ful z-40 flex justify-center">
            <BarLoader width={680} color="#DA4453" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
