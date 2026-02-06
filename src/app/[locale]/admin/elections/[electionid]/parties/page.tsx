"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Plus, MoreHorizontal, Edit, Trash2, Send, Mail } from "lucide-react";
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
import {
  Breadcrumb,
  DataTable,
  PartyStatusBadge,
  AnswerProgressBadge,
  type Column,
} from "@/components/admin";
import { mockGetParties, mockDeleteParty } from "@/actions/admin";
import type { AdminParty } from "@/types/admin";

export default function PartiesManagementPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const electionId = params.electionid as string;

  const [parties, setParties] = useState<AdminParty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockGetParties(parseInt(electionId));
        setParties(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [electionId]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this party?")) {
      await mockDeleteParty(id);
      setParties(parties.filter((p) => p.id !== id));
    }
  };

  const columns: Column<AdminParty>[] = [
    {
      key: "shortName",
      header: "Party",
      sortable: true,
      render: (party) => (
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full"
            style={{ backgroundColor: party.color }}
          />
          <div>
            <Link
              href={`/${locale}/admin/elections/${electionId}/parties/${party.id}`}
              className="font-medium hover:underline"
            >
              {party.shortName}
            </Link>
            <p className="text-xs text-muted-foreground">
              {party.detailedName}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "agents",
      header: "Party Admin",
      render: (party) =>
        party.agents.length > 0 ? (
          <div>
            <p className="text-sm">{party.agents[0].email}</p>
            <p className="text-xs text-muted-foreground">
              {party.agents[0].firstName} {party.agents[0].lastName}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground">Not assigned</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (party) => <PartyStatusBadge status={party.status} />,
    },
    {
      key: "answerProgress",
      header: "Progress",
      render: (party) => (
        <AnswerProgressBadge progress={party.answerProgress} />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (party) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/${locale}/admin/elections/${electionId}/parties/${party.id}`,
                )
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Send className="mr-2 h-4 w-4" />
              Send Invitation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Reminder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(party.id)}
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
          <Breadcrumb
            items={[
              { label: "Elections", href: `/${locale}/admin/elections` },
              {
                label: `#${electionId}`,
                href: `/${locale}/admin/elections/${electionId}`,
              },
              { label: "Parties" },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold">Party Management</h1>
          <p className="text-muted-foreground">
            Manage political parties for this election
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/elections/${electionId}/parties/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Party
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Parties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Invited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parties.filter((p) => p.status === "invited").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parties.filter((p) => p.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parties.filter((p) => p.status === "voted").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parties Table */}
      <DataTable
        data={parties}
        columns={columns}
        keyField="id"
        searchable
        searchPlaceholder="Search parties..."
        searchFields={["shortName", "detailedName"]}
        onRowClick={(party) =>
          router.push(
            `/${locale}/admin/elections/${electionId}/parties/${party.id}`,
          )
        }
        emptyMessage="No parties yet. Add a party to get started."
      />
    </div>
  );
}
