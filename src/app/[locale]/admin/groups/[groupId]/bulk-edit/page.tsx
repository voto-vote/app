"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  CheckSquare,
  Square,
  AlertCircle,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumb, ElectionStageBadge } from "@/components/admin";
import {
  mockGetGroup,
  mockGetElections,
  mockBulkEditElections,
} from "@/actions/admin";
import { useAdminBulkEditStore } from "@/stores/admin";
import type {
  ElectionGroup,
  AdminElection,
  ElectionStage,
} from "@/types/admin";

type BulkEditField = "stage" | "date" | "settings";

export default function BulkEditPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const groupId = parseInt(params.groupId as string);

  const { selectedIds, toggleSelection, selectAll, clearSelection } =
    useAdminBulkEditStore();
  const [group, setGroup] = useState<ElectionGroup | null>(null);
  const [elections, setElections] = useState<AdminElection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editField, setEditField] = useState<BulkEditField | "">("");
  const [bulkStage, setBulkStage] = useState<ElectionStage>("created");
  const [bulkDate, setBulkDate] = useState("");
  const [bulkSettings, setBulkSettings] = useState({
    faqEnabled: false,
    surveyEnabled: false,
    ctaEnabled: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [groupData, allElections] = await Promise.all([
          mockGetGroup(groupId),
          mockGetElections(),
        ]);

        if (groupData) {
          setGroup(groupData);
          const groupElections = allElections.filter(
            (e) => e.groupId === groupId,
          );
          setElections(groupElections);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      clearSelection();
    };
  }, [groupId, clearSelection]);

  const handleSelectAll = () => {
    if (selectedIds.length === elections.length) {
      clearSelection();
    } else {
      selectAll(elections.map((e) => e.id));
    }
  };

  const handleBulkEdit = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one election");
      return;
    }

    if (!editField) {
      alert("Please select a field to edit");
      return;
    }

    setSaving(true);
    try {
      let changes: Record<string, unknown> = {};

      if (editField === "stage") {
        changes = { stage: bulkStage };
      } else if (editField === "date") {
        changes = { electionDate: new Date(bulkDate).toISOString() };
      } else if (editField === "settings") {
        changes = { settings: bulkSettings };
      }

      await mockBulkEditElections({
        electionIds: selectedIds as number[],
        changes,
      });

      alert(`Successfully updated ${selectedIds.length} election(s)!`);
      clearSelection();
      router.push(`/${locale}/admin/groups/${groupId}`);
    } finally {
      setSaving(false);
    }
  };

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

  const isAllSelected =
    selectedIds.length === elections.length && elections.length > 0;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < elections.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb
            items={[
              { label: "Election Groups", href: `/${locale}/admin/groups` },
              { label: group.name, href: `/${locale}/admin/groups/${groupId}` },
              { label: "Bulk Edit" },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold">Bulk Edit Elections</h1>
          <p className="text-muted-foreground">
            Make changes to multiple elections at once
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/admin/groups/${groupId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Group
          </Link>
        </Button>
      </div>

      {/* Selection Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Elections</CardTitle>
              <CardDescription>
                Choose which elections to edit ({selectedIds.length} of{" "}
                {elections.length} selected)
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleSelectAll}>
              {isAllSelected ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Deselect All
                </>
              ) : (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Select All
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {elections.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No elections in this group
              </p>
            ) : (
              elections.map((election) => (
                <div
                  key={election.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                    selectedIds.includes(election.id)
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    checked={selectedIds.includes(election.id)}
                    onCheckedChange={() => toggleSelection(election.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{election.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {election.location?.name || "No location"}
                    </p>
                  </div>
                  <ElectionStageBadge stage={election.stage} />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Options */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Options</CardTitle>
          <CardDescription>
            Select what you want to change for the selected elections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>What do you want to edit?</Label>
            <Select
              value={editField}
              onValueChange={(value) => setEditField(value as BulkEditField)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field to edit..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stage">Election Stage</SelectItem>
                <SelectItem value="date">Election Date</SelectItem>
                <SelectItem value="settings">
                  Settings (FAQ, Survey, CTA)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {editField === "stage" && (
            <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
              <Label>New Stage</Label>
              <Select
                value={bulkStage}
                onValueChange={(value) => setBulkStage(value as ElectionStage)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="thesis-entry">Thesis Entry</SelectItem>
                  <SelectItem value="answering">Answering</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 text-xs text-yellow-600">
                <AlertCircle className="h-3 w-3" />
                <span>
                  Changing stage may affect party and candidate access
                </span>
              </div>
            </div>
          )}

          {editField === "date" && (
            <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
              <Label>New Election Date</Label>
              <Input
                type="date"
                value={bulkDate}
                onChange={(e) => setBulkDate(e.target.value)}
              />
            </div>
          )}

          {editField === "settings" && (
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <Label>Settings to update</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="faq"
                    checked={bulkSettings.faqEnabled}
                    onCheckedChange={(checked) =>
                      setBulkSettings({
                        ...bulkSettings,
                        faqEnabled: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="faq" className="font-normal">
                    Enable FAQ section
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="survey"
                    checked={bulkSettings.surveyEnabled}
                    onCheckedChange={(checked) =>
                      setBulkSettings({
                        ...bulkSettings,
                        surveyEnabled: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="survey" className="font-normal">
                    Enable Survey
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="cta"
                    checked={bulkSettings.ctaEnabled}
                    onCheckedChange={(checked) =>
                      setBulkSettings({
                        ...bulkSettings,
                        ctaEnabled: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="cta" className="font-normal">
                    Enable Call-to-Action
                  </Label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {selectedIds.length > 0
            ? `${selectedIds.length} election(s) will be updated`
            : "Select elections to edit"}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/admin/groups/${groupId}`)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkEdit}
            disabled={saving || selectedIds.length === 0 || !editField}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Applying..." : "Apply Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
