"use client";

import type { ReactNode } from "react";
import { useAdminAuthStore } from "@/stores/admin";
import type { Permission } from "@/types/admin";

type RoleGuardProps = {
  permissions: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
};

export function RoleGuard({
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: RoleGuardProps) {
  const { hasPermission, hasAnyPermission } = useAdminAuthStore();

  const hasAccess = requireAll
    ? permissions.every((p) => hasPermission(p))
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
