"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  LayoutDashboard,
  Menu,
  PenTool,
  Settings,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Post",
    href: "/dashboard/create",
    icon: PenTool,
  },
  {
    title: "Posts",
    href: "/dashboard/posts",
    icon: FileText,
  },
  {
    title: "Followers",
    href: "/dashboard/followers",
    icon: Users,
  },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const {data: draftPost} = useConvexQuery(api.posts.getUserDraft);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Mobile Navigation */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 z-50 transition-transform duration-300 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Muse Logo"
              width={96}
              height={32}
              className="h-14 sm:h-16 md:h-18 w-auto object-contain"
            />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div
                  className={cn(
                    "flex items-center rounded-xl space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-linear-to-r from-purple-600/20 to-blue-600/20 border-purple-500 text-white"
                      : "text-slate-300 hover:bg-slate-700/20 hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-purple-400" : "text-white",
                    )}
                  />
                  <span>{item.title}</span>
                  {item.title === "Create Post" && draftPost  && (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-xs bg-orange-500/20 border-orange-500/20 text-orange-300"
                    >
                      Draft
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link href="/dashboard/settings">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-slate-300 hover:text-white rounded-xl p-4"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </aside>
      <div className="lg:ml-64 ml-0">
        <header className="fixed w-full top-0 right-0 z-30 bg-slate-800/80 backdrop-blur-md border-b border-slate-700">
          <div className="flex items-center justify-between px-4 lg:px-8 py-0 lg:py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="m-4 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-10 flex items-center space-x-4">
              <UserButton />
            </div>
          </div>
        </header>
        <main className="mt-18">{children}</main>
        <Toaster richColors  />
      </div>
    </div>
  );
};

export default DashboardLayout;
