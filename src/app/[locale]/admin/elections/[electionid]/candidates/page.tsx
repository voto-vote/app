"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Plus, MoreHorizontal, Edit, Trash2, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  CandidateStatusBadge,
  AnswerProgressBadge,
  type Column,
} from "@/components/admin";
import { mockGetCandidates, mockDeleteCandidate } from "@/actions/admin";
import type { AdminCandidate } from "@/types/admin";

export default function CandidatesManagementPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const electionId = params.electionid as string;

  const [candidates, setCandidates] = useState<AdminCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockGetCandidates(parseInt(electionId));
        setCandidates(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [electionId]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this candidate?")) {
      await mockDeleteCandidate(id);
      setCandidates(candidates.filter((c) => c.id !== id));
    }
  };

  const columns: Column<AdminCandidate>[] = [
    {
      key: "lastName",
      header: "Candidate",
      sortable: true,
      render: (candidate) => (
        <div className="flex items-center gap-3">
          {candidate.profilePicture ? (
            <img
              src={candidate.profilePicture}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {candidate.firstName[0]}
              {candidate.lastName[0]}
            </div>
          )}
          <div>
            <Link
              href={`/${locale}/admin/elections/${electionId}/candidates/${candidate.id}`}
              className="font-medium hover:underline"
            >
              {candidate.title ? `${candidate.title} ` : ""}
              {candidate.firstName} {candidate.lastName}
            </Link>
            <p className="text-xs text-muted-foreground">{candidate.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "partyName",
      header: "Party",
      sortable: true,
    },
    {
      key: "district",
      header: "District",
      sortable: true,
      render: (candidate) => candidate.district || "-",
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (candidate) => <CandidateStatusBadge status={candidate.status} />,
    },
    {
      key: "answerProgress",
      header: "Progress",
      render: (candidate) => (
        <AnswerProgressBadge progress={candidate.answerProgress} />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (candidate) => (
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
                  `/${locale}/admin/elections/${electionId}/candidates/${candidate.id}`,
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
              onClick={() => handleDelete(candidate.id)}
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
              { label: "Candidates" },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold">Candidate Management</h1>
          <p className="text-muted-foreground">
            Manage candidates for this election
          </p>
        </div>
        <Button asChild>
          <Link
            href={`/${locale}/admin/elections/${electionId}/candidates/new`}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Invited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidates.filter((c) => c.status === "invited").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidates.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidates.filter((c) => c.status === "voted").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Table */}
      <DataTable
        data={candidates}
        columns={columns}
        keyField="id"
        searchable
        searchPlaceholder="Search candidates..."
        searchFields={["firstName", "lastName", "email", "partyName"]}
        onRowClick={(candidate) =>
          router.push(
            `/${locale}/admin/elections/${electionId}/candidates/${candidate.id}`,
          )
        }
        emptyMessage="No candidates yet. Add a candidate to get started."
      />
    </div>
  );
}
