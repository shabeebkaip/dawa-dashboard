"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Calendar,
  Network,
  BookOpen,
  Lightbulb,
  FileText,
  Settings,
  ChevronDown,
  Menu,
  X,
  Database,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/hooks/useSession";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Events", href: "/admin/events", icon: Calendar },
      { title: "Posts", href: "/admin/posts", icon: FileText },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "Master Data",
        icon: Database,
        children: [
          { title: "Categories", href: "/admin/categories", icon: FolderTree },
          { title: "Sub Categories", href: "/admin/sub-categories", icon: Network },
          { title: "Subject Master", href: "/admin/subject-master", icon: BookOpen },
          { title: "Topic Master", href: "/admin/topic-master", icon: Lightbulb },
          { title: "Common", href: "/admin/common", icon: Settings },
        ],
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set(["Master Data"])
  );

  const toggleExpanded = (title: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedItems(newExpanded);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden bg-white shadow-md border border-border hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-gray-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Image
                src="/logo.svg"
                alt="Dawa App"
                width={24}
                height={24}
                className="h-6 w-6 brightness-0 invert"
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">Dawa App</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-6">
              {navigationGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.title}
                  </h3>
                  <nav className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      const isExpanded = expandedItems.has(item.title);
                      const hasChildren = item.children && item.children.length > 0;

                      return (
                        <div key={item.href || item.title}>
                          {hasChildren ? (
                            <div>
                              <button
                                onClick={() => toggleExpanded(item.title)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors group"
                              >
                                <Icon className="h-5 w-5 text-gray-500 group-hover:text-primary transition-colors" />
                                <span className="flex-1 text-left">{item.title}</span>
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 text-gray-400 transition-transform duration-200",
                                    isExpanded ? "rotate-0" : "-rotate-90"
                                  )}
                                />
                              </button>
                              {isExpanded && (
                                <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                                  {item.children!.map((child) => {
                                    const ChildIcon = child.icon;
                                    const isChildActive = pathname === child.href;
                                    return (
                                      <Link
                                        key={child.href}
                                        href={child.href!}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                          isChildActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        )}
                                      >
                                        <ChildIcon className="h-4 w-4" />
                                        <span>{child.title}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Link
                              href={item.href!}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors group",
                                isActive
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-gray-700 hover:bg-gray-100"
                              )}
                            >
                              <Icon className={cn(
                                "h-5 w-5 transition-colors",
                                isActive ? "text-primary-foreground" : "text-gray-500 group-hover:text-primary"
                              )} />
                              <span className="flex-1">{item.title}</span>
                              {item.badge && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground px-1.5">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer with Logout */}
          <div className="border-t border-gray-100 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
