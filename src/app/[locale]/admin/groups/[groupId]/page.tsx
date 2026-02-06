"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Calendar,
  Vote,
  ArrowRight,
  Settings,
  Trash2,
  ArrowLeftRight,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  DataTable,
  ElectionStageBadge,
  type Column,
} from "@/components/admin";
import {
  mockGetGroup,
  mockUpdateGroup,
  mockGetElections,
  mockMoveElectionToGroup,
} from "@/actions/admin";
import type { ElectionGroup, AdminElection } from "@/types/admin";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const groupId = parseInt(params.groupId as string);

  const [group, setGroup] = useState<ElectionGroup | null>(null);
  const [elections, setElections] = useState<AdminElection[]>([]);
  const [allElections, setAllElections] = useState<AdminElection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addElectionDialogOpen, setAddElectionDialogOpen] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState<string>("");

  const [editFormData, setEditFormData] = useState({
    name: "",
    date: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [groupData, allElectionsData] = await Promise.all([
          mockGetGroup(groupId),
          mockGetElections(),
        ]);

        if (groupData) {
          setGroup(groupData);
          setEditFormData({
            name: groupData.name,
            date: groupData.date.split("T")[0],
          });

          // Filter elections that belong to this group
          const groupElections = allElectionsData.filter(
            (e) => e.groupId === groupId,
          );
          setElections(groupElections);
        }

        // Get standalone elections for the "add" dialog
        setAllElections(allElectionsData.filter((e) => !e.groupId));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [groupId]);

  const handleUpdateGroup = async () => {
    if (!group) return;

    const updated = await mockUpdateGroup(groupId, {
      name: editFormData.name,
      date: new Date(editFormData.date).toISOString(),
    });

    if (updated) {
      setGroup(updated);
      setEditDialogOpen(false);
    }
  };

  const handleAddElection = async () => {
    if (!selectedElectionId) return;

    const result = await mockMoveElectionToGroup({
      electionId: parseInt(selectedElectionId),
      groupId,
    });

    if (result) {
      // Refresh elections
      const election = allElections.find(
        (e) => e.id === parseInt(selectedElectionId),
      );
      if (election) {
        setElections([...elections, { ...election, groupId }]);
        setAllElections(allElections.filter((e) => e.id !== election.id));
      }
      setAddElectionDialogOpen(false);
      setSelectedElectionId("");
    }
  };

  const handleRemoveFromGroup = async (electionId: number) => {
    if (!confirm("Remove this election from the group?")) return;

    await mockMoveElectionToGroup({
      electionId,
      groupId: null,
    });

    const election = elections.find((e) => e.id === electionId);
    if (election) {
      setElections(elections.filter((e) => e.id !== electionId));
      setAllElections([...allElections, { ...election, groupId: undefined }]);
    }
  };

  const columns: Column<AdminElection>[] = [
    {
      key: "title",
      header: "Election",
      sortable: true,
      render: (election) => (
        <div>
          <Link
            href={`/${locale}/admin/elections/${election.id}`}
            className="font-medium hover:underline"
          >
            {election.title}
          </Link>
          <p className="text-xs text-muted-foreground">
            {election.location?.name || "No location"}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (election) => (
        <span className="capitalize">{election.type.replace("-", " ")}</span>
      ),
    },
    {
      key: "stage",
      header: "Stage",
      sortable: true,
      render: (election) => <ElectionStageBadge stage={election.stage} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-32",
      render: (election) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.push(`/${locale}/admin/elections/${election.id}`)
            }
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveFromGroup(election.id)}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
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

  if (!group) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Group not found.</p>
        <Button asChild className="mt-4">
          <Link href={`/${locale}/admin/groups`}>Back to Groups</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb
            items={[
              { label: "Election Groups", href: `/${locale}/admin/groups` },
              { label: group.name },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground">
            {new Date(group.date).toLocaleDateString("de-DE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Group
          </Button>
          <Button asChild>
            <Link href={`/${locale}/admin/groups/${groupId}/bulk-edit`}>
              <Settings className="mr-2 h-4 w-4" />
              Bulk Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{elections.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {elections.filter((e) => e.stage === "created").length} elections
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Answering</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {elections.filter((e) => e.stage === "answering").length}{" "}
              elections
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Live</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {elections.filter((e) => e.stage === "live").length} elections
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Elections in Group */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Elections in Group</CardTitle>
              <CardDescription>
                Manage elections within this group
              </CardDescription>
            </div>
            <Button onClick={() => setAddElectionDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Election
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={elections}
            columns={columns}
            keyField="id"
            searchable
            searchPlaceholder="Search elections..."
            searchFields={["title"]}
            onRowClick={(election) =>
              router.push(`/${locale}/admin/elections/${election.id}`)
            }
            emptyMessage="No elections in this group yet. Add elections or create new ones."
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/admin/elections/new?groupId=${groupId}`}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Election
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/admin/groups/${groupId}/bulk-edit`}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Bulk Edit All
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Edit Group Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>
              Update the group name and election date
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Group Name</Label>
              <Input
                id="editName"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDate">Election Date</Label>
              <Input
                id="editDate"
                type="date"
                value={editFormData.date}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, date: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateGroup}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Election Dialog */}
      <Dialog
        open={addElectionDialogOpen}
        onOpenChange={setAddElectionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Election to Group</DialogTitle>
            <DialogDescription>
              Select a standalone election to add to this group
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Election</Label>
              <Select
                value={selectedElectionId}
                onValueChange={setSelectedElectionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an election..." />
                </SelectTrigger>
                <SelectContent>
                  {allElections.length === 0 ? (
                    <SelectItem value="__empty__" disabled>
                      No standalone elections available
                    </SelectItem>
                  ) : (
                    allElections.map((election) => (
                      <SelectItem
                        key={election.id}
                        value={election.id.toString()}
                      >
                        {election.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setAddElectionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddElection}
                disabled={!selectedElectionId}
              >
                Add to Group
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
