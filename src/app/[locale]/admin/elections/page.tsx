"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Plus, MoreHorizontal, Copy, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  DataTable,
  ElectionStageBadge,
  RoleGuard,
  type Column,
} from "@/components/admin";
import {
  mockGetElections,
  mockDeleteElection,
  mockDuplicateElection,
} from "@/actions/admin";
import type { AdminElection } from "@/types/admin";

export default function ElectionsListPage() {
  const router = useRouter();
  const locale = useLocale();
  const [elections, setElections] = useState<AdminElection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await mockGetElections();
        setElections(data);
      } finally {
        setLoading(false);
      }
    };

    loadElections();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this election?")) {
      await mockDeleteElection(id);
      setElections(elections.filter((e) => e.id !== id));
    }
  };

  const handleDuplicate = async (id: number) => {
    const duplicated = await mockDuplicateElection(id);
    if (duplicated) {
      setElections([...elections, duplicated]);
    }
  };

  const columns: Column<AdminElection>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (election) => (
        <div>
          <Link
            href={`/${locale}/admin/elections/${election.id}`}
            className="font-medium hover:underline"
          >
            {election.name}
          </Link>
          {election.groupId && (
            <p className="text-xs text-muted-foreground">
              Group #{election.groupId}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      sortable: true,
    },
    {
      key: "electionType",
      header: "Type",
      render: (election) => (
        <span className="capitalize">
          {election.electionType.replace(/-/g, " ")}
        </span>
      ),
    },
    {
      key: "stage",
      header: "Stage",
      sortable: true,
      render: (election) => <ElectionStageBadge stage={election.stage} />,
    },
    {
      key: "electionDate",
      header: "Date",
      sortable: true,
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (election) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/${locale}/admin/elections/${election.id}`)
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDuplicate(election.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(election.id)}
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
          <Breadcrumb items={[{ label: "Elections" }]} />
          <h1 className="mt-2 text-2xl font-bold">Elections</h1>
          <p className="text-muted-foreground">
            Manage your elections and voting processes
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

      <DataTable
        data={elections}
        columns={columns}
        keyField="id"
        selectable
        selectedIds={selectedIds}
        onSelectionChange={(ids) => setSelectedIds(ids as number[])}
        searchable
        searchPlaceholder="Search elections..."
        searchFields={["name", "location"]}
        onRowClick={(election) =>
          router.push(`/${locale}/admin/elections/${election.id}`)
        }
        emptyMessage="No elections found. Create your first election to get started."
      />
    </div>
  );
}
