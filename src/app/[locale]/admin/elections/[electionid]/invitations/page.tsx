"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Send, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  DataTable,
  InvitationStatusBadge,
  type Column,
} from "@/components/admin";
import {
  mockGetInvitations,
  mockResendInvitation,
  mockSendInvitations,
} from "@/actions/admin";
import type { Invitation } from "@/types/admin";

export default function InvitationsPage() {
  const params = useParams();
  const locale = useLocale();
  const electionId = params.electionid as string;

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockGetInvitations(parseInt(electionId));
        setInvitations(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [electionId]);

  const handleResend = async (id: string) => {
    const updated = await mockResendInvitation(id);
    if (updated) {
      setInvitations(invitations.map((i) => (i.id === id ? updated : i)));
    }
  };

  const columns: Column<Invitation>[] = [
    {
      key: "recipientName",
      header: "Recipient",
      sortable: true,
      render: (inv) => (
        <div>
          <p className="font-medium">{inv.recipientName}</p>
          <p className="text-xs text-muted-foreground">{inv.recipientEmail}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (inv) => (
        <span className="capitalize">{inv.type.replace("-", " ")}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (inv) => <InvitationStatusBadge status={inv.status} />,
    },
    {
      key: "sentAt",
      header: "Sent",
      sortable: true,
      render: (inv) =>
        inv.sentAt ? new Date(inv.sentAt).toLocaleDateString() : "-",
    },
    {
      key: "expiresAt",
      header: "Expires",
      sortable: true,
      render: (inv) => new Date(inv.expiresAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (inv) =>
        inv.status !== "accepted" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleResend(inv.id)}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Resend
          </Button>
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

  const pending = invitations.filter((i) => i.status === "pending").length;
  const sent = invitations.filter((i) => i.status === "sent").length;
  const accepted = invitations.filter((i) => i.status === "accepted").length;
  const expired = invitations.filter((i) => i.status === "expired").length;

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
              { label: "Invitations" },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold">Invitations</h1>
          <p className="text-muted-foreground">
            Manage invitation status for parties and candidates
          </p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send New Invitations
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{accepted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invitations</CardTitle>
          <CardDescription>
            Track and manage all sent invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={invitations}
            columns={columns}
            keyField="id"
            searchable
            searchPlaceholder="Search invitations..."
            searchFields={["recipientName", "recipientEmail"]}
            emptyMessage="No invitations sent yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}
