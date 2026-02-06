"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  ChangeRequestStatusBadge,
  StatusBadge,
} from "@/components/admin";
import {
  mockGetChangeRequests,
  mockReviewChangeRequest,
} from "@/actions/admin";
import type { ChangeRequest, ChangeRequestStatus } from "@/types/admin";

export default function ChangeRequestsPage() {
  const params = useParams();
  const locale = useLocale();
  const electionId = params.electionid as string;

  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(
    null,
  );
  const [reviewNotes, setReviewNotes] = useState("");
  const [activeTab, setActiveTab] = useState<ChangeRequestStatus | "all">(
    "pending",
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockGetChangeRequests(parseInt(electionId));
        setRequests(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [electionId]);

  const handleReview = async (status: "approved" | "rejected") => {
    if (!selectedRequest) return;

    const updated = await mockReviewChangeRequest(selectedRequest.id, {
      status,
      reviewNotes,
    });

    if (updated) {
      setRequests(requests.map((r) => (r.id === updated.id ? updated : r)));
      setSelectedRequest(null);
      setReviewNotes("");
    }
  };

  const filteredRequests =
    activeTab === "all"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb
          items={[
            { label: "Elections", href: `/${locale}/admin/elections` },
            {
              label: `#${electionId}`,
              href: `/${locale}/admin/elections/${electionId}`,
            },
            { label: "Change Requests" },
          ]}
        />
        <h1 className="mt-2 text-2xl font-bold">Change Requests</h1>
        <p className="text-muted-foreground">
          Review and approve change requests from parties and candidates
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter((r) => r.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter((r) => r.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {requests.filter((r) => r.status === "rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Change Requests</CardTitle>
          <CardDescription>
            Review requests to modify locked content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(v) =>
              setActiveTab(v as ChangeRequestStatus | "all")
            }
          >
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({requests.filter((r) => r.status === "pending").length}
                )
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              {filteredRequests.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No change requests found.
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <StatusBadge variant="purple">
                            {request.type}
                          </StatusBadge>
                          <ChangeRequestStatusBadge status={request.status} />
                        </div>
                        <p className="text-sm font-medium">
                          {request.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Requested by {request.requestedByName} (
                          {request.requestedByRole}) on{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.reviewNotes && (
                          <p className="text-xs text-muted-foreground">
                            Review notes: {request.reviewNotes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600"
                              onClick={() => {
                                setSelectedRequest(request);
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => {
                                setSelectedRequest(request);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => {
          setSelectedRequest(null);
          setReviewNotes("");
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Change Request</DialogTitle>
            <DialogDescription>
              Review the requested changes and approve or reject
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.description}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Changes</p>
                <div className="mt-2 space-y-2">
                  {selectedRequest.changes.map((change, i) => (
                    <div key={i} className="rounded-md bg-muted p-3 text-sm">
                      <p className="font-medium">{change.field}</p>
                      <p className="text-muted-foreground">
                        Current: {String(change.currentValue)}
                      </p>
                      <p className="text-green-600">
                        Requested: {String(change.requestedValue)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {selectedRequest.status === "pending" && (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Review Notes (optional)
                    </p>
                    <Textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add a note for the requester..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleReview("rejected")}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleReview("approved")}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
