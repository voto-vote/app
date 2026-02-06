"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { AdminSidebar } from "@/components/admin";
import { useAdminAuthStore } from "@/stores/admin";
import { mockGetCurrentUser } from "@/actions/admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const locale = useLocale();
  const { user, setUser, setLoading, isLoading, isAuthenticated } =
    useAdminAuthStore();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        const currentUser = await mockGetCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          router.push(`/${locale}/admin/login`);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, setUser, setLoading, router, locale]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Check terms acceptance
  if (user && !user.agreedToTerms) {
    // If on terms page, show it
    router.push(`/${locale}/admin/terms`);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
