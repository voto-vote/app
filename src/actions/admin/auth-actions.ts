"use server";

import type { AdminUser, AuthProvider } from "@/types/admin";
import { simulateDelay } from "@/lib/admin/mock-utils";
import { mockUsers } from "@/lib/admin/mock-data";

export async function mockLoginWithProvider(
  provider: AuthProvider,
): Promise<AdminUser | null> {
  await simulateDelay(500);

  // Mock: Return test user based on provider
  // In real implementation, this would redirect to OAuth provider
  console.log(`Mock login with provider: ${provider}`);

  // Return superadmin for testing
  return mockUsers[0];
}

export async function mockSendMagicLink(
  email: string,
): Promise<{ success: boolean; message: string }> {
  await simulateDelay(300);

  // Mock: Simulate sending magic link
  console.log(`Mock magic link sent to: ${email}`);

  return {
    success: true,
    message: `Magic link sent to ${email}. Please check your inbox.`,
  };
}

export async function mockVerifyMagicLink(
  token: string,
): Promise<AdminUser | null> {
  await simulateDelay(400);

  // Mock: Verify magic link token
  console.log(`Mock verify magic link: ${token}`);

  // Find user by email in mock data or return first user
  return mockUsers[0];
}

export async function mockAcceptTerms(
  userId: number,
  version: string,
): Promise<boolean> {
  await simulateDelay(200);

  console.log(`Mock accept terms: userId=${userId}, version=${version}`);
  return true;
}

export async function mockGetCurrentUser(): Promise<AdminUser | null> {
  await simulateDelay(100);

  // Mock: Return the first user as current user
  // In real implementation, this would check session
  return mockUsers[0];
}

export async function mockLogout(): Promise<void> {
  await simulateDelay(100);
  console.log("Mock logout");
}

export async function mockGetUsers(): Promise<AdminUser[]> {
  await simulateDelay(300);
  return mockUsers;
}

export async function mockUpdateUserRole(
  userId: number,
  role: AdminUser["role"],
  permissions: AdminUser["permissions"],
): Promise<AdminUser | null> {
  await simulateDelay(300);

  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return null;

  return {
    ...user,
    role,
    permissions,
  };
}
