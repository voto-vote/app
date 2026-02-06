"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items?: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items: customItems, className }: BreadcrumbProps) {
  const pathname = usePathname();
  const locale = useLocale();

  // Auto-generate breadcrumbs from pathname if not provided
  const items: BreadcrumbItem[] =
    customItems || generateBreadcrumbs(pathname, locale);

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link
            href={`/${locale}/admin`}
            className="flex items-center hover:text-foreground"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4" />
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function generateBreadcrumbs(
  pathname: string,
  locale: string,
): BreadcrumbItem[] {
  // Remove locale prefix
  const cleanPath = pathname.replace(`/${locale}`, "");
  const segments = cleanPath.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [];
  let currentPath = `/${locale}`;

  // Label mappings for common paths
  const labelMap: Record<string, string> = {
    admin: "Admin",
    elections: "Elections",
    groups: "Groups",
    users: "Users",
    profile: "Profile",
    theses: "Theses",
    parties: "Parties",
    candidates: "Candidates",
    invitations: "Invitations",
    communication: "Communication",
    "change-requests": "Change Requests",
    settings: "Settings",
    export: "Export",
    new: "New",
    "bulk-edit": "Bulk Edit",
    answers: "Answers",
  };

  for (const segment of segments) {
    currentPath += `/${segment}`;

    // Skip admin segment (already shown as home)
    if (segment === "admin") continue;

    // Check if segment is an ID (numeric)
    if (/^\d+$/.test(segment)) {
      items.push({
        label: `#${segment}`,
        href: currentPath,
      });
    } else {
      items.push({
        label: labelMap[segment] || capitalizeFirst(segment),
        href: currentPath,
      });
    }
  }

  return items;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
}
