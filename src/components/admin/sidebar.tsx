"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  Vote,
  FileText,
  Users,
  Building2,
  Mail,
  MessageSquare,
  Settings,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminSidebarStore } from "@/stores/admin";
import { useAdminAuthStore } from "@/stores/admin";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  permissions?: string[];
};

const mainNavItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/elections",
    label: "Elections",
    icon: Vote,
  },
  {
    href: "/admin/groups",
    label: "Election Groups",
    icon: FolderOpen,
    permissions: ["manage:groups"],
  },
];

const getElectionNavItems = (electionId: string): NavItem[] => [
  {
    href: `/admin/elections/${electionId}`,
    label: "Overview",
    icon: Settings,
  },
  {
    href: `/admin/elections/${electionId}/theses`,
    label: "Theses",
    icon: FileText,
  },
  {
    href: `/admin/elections/${electionId}/parties`,
    label: "Parties",
    icon: Building2,
  },
  {
    href: `/admin/elections/${electionId}/candidates`,
    label: "Candidates",
    icon: Users,
  },
  {
    href: `/admin/elections/${electionId}/invitations`,
    label: "Invitations",
    icon: Mail,
  },
  {
    href: `/admin/elections/${electionId}/communication`,
    label: "Communication",
    icon: MessageSquare,
  },
  {
    href: `/admin/elections/${electionId}/change-requests`,
    label: "Change Requests",
    icon: AlertCircle,
    badge: 2,
  },
];

const bottomNavItems: NavItem[] = [
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    permissions: ["manage:users"],
  },
  {
    href: "/admin/profile",
    label: "Profile",
    icon: User,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const { isCollapsed, toggleCollapse } = useAdminSidebarStore();
  const { user, clearUser, hasPermission } = useAdminAuthStore();

  // Check if we're in an election context
  const electionMatch = pathname.match(/\/admin\/elections\/(\d+)/);
  const currentElectionId = electionMatch?.[1];

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === "/admin") {
      return pathname === fullPath;
    }
    return pathname.startsWith(fullPath);
  };

  const filterByPermission = (items: NavItem[]) =>
    items.filter(
      (item) =>
        !item.permissions ||
        item.permissions.some((p) => hasPermission(p as never)),
    );

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    const content = (
      <Link
        href={`/${locale}${item.href}`}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          active && "bg-accent text-accent-foreground font-medium",
          isCollapsed && "justify-center px-2",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">
            {item.label}
            {item.badge && ` (${item.badge})`}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.href}>{content}</div>;
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex h-screen flex-col border-r bg-card transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center border-b px-4">
          {!isCollapsed && (
            <Link
              href={`/${locale}/admin`}
              className="flex items-center gap-2 font-semibold"
            >
              <Vote className="h-6 w-6 text-primary" />
              <span>VOTO Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className={cn("ml-auto", isCollapsed && "mx-auto")}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {filterByPermission(mainNavItems).map(renderNavItem)}
          </div>

          {/* Election-specific navigation */}
          {currentElectionId && (
            <>
              <div className="my-4 border-t" />
              {!isCollapsed && (
                <h4 className="mb-2 px-3 text-xs font-medium text-muted-foreground">
                  Election Settings
                </h4>
              )}
              <div className="space-y-1">
                {getElectionNavItems(currentElectionId).map(renderNavItem)}
              </div>
            </>
          )}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t p-2">
          <div className="space-y-1">
            {filterByPermission(bottomNavItems).map(renderNavItem)}
          </div>

          {/* User Info & Logout */}
          {user && (
            <div
              className={cn(
                "mt-2 flex items-center gap-2 rounded-lg border p-2",
                isCollapsed && "justify-center p-1",
              )}
            >
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.role}
                  </p>
                </div>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => clearUser()}
                    className="shrink-0"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={isCollapsed ? "right" : "top"}>
                  Logout
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
