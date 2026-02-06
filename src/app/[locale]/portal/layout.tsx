"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Home, User, FileText, LogOut, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuthStore } from "@/stores/admin";
import { mockGetCurrentUser } from "@/actions/admin";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { user, setUser, logout } = useAdminAuthStore();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await mockGetCurrentUser();
        if (!currentUser) {
          router.push(`/${locale}/admin/login`);
          return;
        }
        if (!currentUser.hasAcceptedTerms) {
          router.push(`/${locale}/admin/terms`);
          return;
        }
        // Portal is only for partyadmin and candidate roles
        if (
          currentUser.role !== "partyadmin" &&
          currentUser.role !== "candidate"
        ) {
          router.push(`/${locale}/admin`);
          return;
        }
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router, locale, setUser]);

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/admin/login`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigation =
    user.role === "partyadmin"
      ? [
          { name: "Dashboard", href: `/${locale}/portal`, icon: Home },
          {
            name: "Party Profile",
            href: `/${locale}/portal/party/${user.partyIds?.[0] || 1}`,
            icon: User,
          },
          {
            name: "Answer Theses",
            href: `/${locale}/portal/party/${user.partyIds?.[0] || 1}/answers`,
            icon: FileText,
          },
        ]
      : [
          { name: "Dashboard", href: `/${locale}/portal`, icon: Home },
          {
            name: "My Profile",
            href: `/${locale}/portal/candidate/${user.candidateIds?.[0] || 1}`,
            icon: User,
          },
          {
            name: "Answer Theses",
            href: `/${locale}/portal/candidate/${user.candidateIds?.[0] || 1}/answers`,
            icon: FileText,
          },
        ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link href={`/${locale}/portal`} className="text-xl font-bold">
              VOTO Portal
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t bg-background p-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl p-4 md:p-6">{children}</main>
    </div>
  );
}
