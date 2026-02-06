"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Vote,
  FolderOpen,
  Users,
  Building2,
  FileText,
  Plus,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, ElectionStageBadge, RoleGuard } from "@/components/admin";
import { useAdminAuthStore } from "@/stores/admin";
import {
  mockGetElections,
  mockGetGroups,
  mockGetChangeRequests,
} from "@/actions/admin";
import type {
  AdminElection,
  ElectionGroup,
  ChangeRequest,
} from "@/types/admin";

export default function AdminDashboardPage() {
  const locale = useLocale();
  const { user } = useAdminAuthStore();
  const [elections, setElections] = useState<AdminElection[]>([]);
  const [groups, setGroups] = useState<ElectionGroup[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [electionsData, groupsData] = await Promise.all([
          mockGetElections(),
          mockGetGroups(),
        ]);
        setElections(electionsData);
        setGroups(groupsData);

        // Load pending change requests for first election
        if (electionsData.length > 0) {
          const requests = await mockGetChangeRequests(
            electionsData[0].id,
            "pending",
          );
          setPendingRequests(requests);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb items={[{ label: "Dashboard" }]} />
          <h1 className="mt-2 text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}!
          </p>
        </div>
        <RoleGuard permissions={["manage:election"]}>
          <Button asChild>
            <Link href={`/${locale}/admin/elections/new`}>
              <Plus className="mr-2 h-4 w-4" />
              New Election
            </Link>
          </Button>
        </RoleGuard>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Elections</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{elections.length}</div>
            <p className="text-xs text-muted-foreground">
              {elections.filter((e) => e.stage === "live").length} live
            </p>
          </CardContent>
        </Card>

        <RoleGuard permissions={["manage:groups"]}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Election Groups
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{groups.length}</div>
              <p className="text-xs text-muted-foreground">
                {groups.reduce((acc, g) => acc + g.elections.length, 0)} total
                elections
              </p>
            </CardContent>
          </Card>
        </RoleGuard>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Change Requests
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.role}</div>
            <p className="text-xs text-muted-foreground">
              {user?.permissions.elections.length || "all"} election access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Elections */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Elections</CardTitle>
          <CardDescription>
            Your most recent election activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {elections.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No elections yet. Create your first election to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {elections.slice(0, 5).map((election) => (
                <div
                  key={election.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{election.name}</h4>
                      <ElectionStageBadge stage={election.stage} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {election.location} &middot; {election.electionDate}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/${locale}/admin/elections/${election.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <RoleGuard permissions={["manage:election"]}>
          <Card className="cursor-pointer hover:bg-accent/50" asChild>
            <Link href={`/${locale}/admin/elections/new`}>
              <CardHeader>
                <Vote className="h-8 w-8 text-primary" />
                <CardTitle className="mt-2">Create Election</CardTitle>
                <CardDescription>
                  Start a new election or voting process
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </RoleGuard>

        <RoleGuard permissions={["manage:groups"]}>
          <Card className="cursor-pointer hover:bg-accent/50" asChild>
            <Link href={`/${locale}/admin/groups/new`}>
              <CardHeader>
                <FolderOpen className="h-8 w-8 text-primary" />
                <CardTitle className="mt-2">Create Group</CardTitle>
                <CardDescription>
                  Group related elections together
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </RoleGuard>

        <Card className="cursor-pointer hover:bg-accent/50" asChild>
          <Link href={`/${locale}/admin/profile`}>
            <CardHeader>
              <Users className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">My Profile</CardTitle>
              <CardDescription>
                View and edit your account settings
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}
