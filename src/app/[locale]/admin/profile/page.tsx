"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Save, User, Shield, Key, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb, StatusBadge } from "@/components/admin";
import { useAdminAuthStore } from "@/stores/admin";

export default function ProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const { user, logout, isLoading } = useAdminAuthStore();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    // Mock save
    setTimeout(() => {
      setSaving(false);
      alert("Profile updated successfully!");
    }, 500);
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/admin/login`);
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "superadmin":
        return "destructive";
      case "electionadmin":
        return "info";
      case "partyadmin":
        return "purple";
      case "candidate":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb items={[{ label: "My Profile" }]} />
          <h1 className="mt-2 text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Your basic account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {(user.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name || "Unknown User"}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge variant={getRoleBadgeVariant(user.role)}>
                  {user.role.replace("admin", " Admin")}
                </StatusBadge>
                <StatusBadge variant="default">
                  {user.provider.replace("-", " ")}
                </StatusBadge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support for assistance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions
          </CardTitle>
          <CardDescription>Your current access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Election Management</h4>
                <p className="text-sm text-muted-foreground">
                  {user.permissions?.canManageAllElections
                    ? "Can manage all elections"
                    : user.permissions?.canManageElections
                      ? `Can manage ${user.permissions.electionIds?.length || 0} assigned election(s)`
                      : "No election management access"}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">User Management</h4>
                <p className="text-sm text-muted-foreground">
                  {user.permissions?.canManageUsers
                    ? "Can manage all users"
                    : "No user management access"}
                </p>
              </div>
            </div>

            {user.role === "partyadmin" && user.partyIds && (
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Party Access</h4>
                <p className="text-sm text-muted-foreground">
                  Managing {user.partyIds.length} party/parties
                </p>
              </div>
            )}

            {user.role === "candidate" && user.candidateIds && (
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Candidate Profile</h4>
                <p className="text-sm text-muted-foreground">
                  Managing your candidate profile
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Authentication and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Authentication Method</h4>
                <p className="text-sm text-muted-foreground capitalize">
                  Signed in with {user.provider.replace("-", " ")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Terms of Service</h4>
                <p className="text-sm text-muted-foreground">
                  {user.hasAcceptedTerms
                    ? `Accepted on ${new Date(user.termsAcceptedAt!).toLocaleDateString()} (v${user.termsVersion})`
                    : "Not yet accepted"}
                </p>
              </div>
              {user.hasAcceptedTerms && (
                <StatusBadge variant="success">Accepted</StatusBadge>
              )}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Last Login</h4>
                <p className="text-sm text-muted-foreground">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-destructive/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-destructive">Sign Out</h4>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Account ID
              </dt>
              <dd className="font-mono text-sm">{user.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Account Created
              </dt>
              <dd className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
