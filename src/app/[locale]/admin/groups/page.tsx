"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  Plus,
  FolderOpen,
  Calendar,
  Vote,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb, DataTable, type Column } from "@/components/admin";
import { mockGetGroups, mockDeleteGroup } from "@/actions/admin";
import type { ElectionGroup } from "@/types/admin";

export default function GroupsPage() {
  const router = useRouter();
  const locale = useLocale();
  const [groups, setGroups] = useState<ElectionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockGetGroups();
        setGroups(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this group? Elections within it will become standalone.",
      )
    ) {
      await mockDeleteGroup(id);
      setGroups(groups.filter((g) => g.id !== id));
    }
  };

  const columns: Column<ElectionGroup>[] = [
    {
      key: "name",
      header: "Group Name",
      sortable: true,
      render: (group) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <Link
              href={`/${locale}/admin/groups/${group.id}`}
              className="font-medium hover:underline"
            >
              {group.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {group.electionCount} election
              {group.electionCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Election Date",
      sortable: true,
      render: (group) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {new Date(group.date).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "electionCount",
      header: "Elections",
      sortable: true,
      render: (group) => (
        <div className="flex items-center gap-2">
          <Vote className="h-4 w-4 text-muted-foreground" />
          {group.electionCount}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (group) => new Date(group.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (group) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/${locale}/admin/groups/${group.id}`)}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              View Group
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/${locale}/admin/groups/${group.id}/bulk-edit`)
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Bulk Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(group.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

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
          <Breadcrumb items={[{ label: "Election Groups" }]} />
          <h1 className="mt-2 text-2xl font-bold">Election Groups</h1>
          <p className="text-muted-foreground">
            Organize related elections into groups for easier management
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/groups/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Group
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Grouped Elections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groups.reduce((sum, g) => sum + g.electionCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groups.filter((g) => new Date(g.date) > new Date()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Groups</CardTitle>
          <CardDescription>
            Click on a group to view and manage its elections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={groups}
            columns={columns}
            keyField="id"
            searchable
            searchPlaceholder="Search groups..."
            searchFields={["name"]}
            onRowClick={(group) =>
              router.push(`/${locale}/admin/groups/${group.id}`)
            }
            emptyMessage="No election groups yet. Create a group to organize related elections."
          />
        </CardContent>
      </Card>
    </div>
  );
}
