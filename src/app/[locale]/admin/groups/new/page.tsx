"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Save } from "lucide-react";
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
import { Breadcrumb } from "@/components/admin";
import { mockCreateGroup } from "@/actions/admin";

export default function NewGroupPage() {
  const router = useRouter();
  const locale = useLocale();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a group name");
      return;
    }

    if (!formData.date) {
      alert("Please select an election date");
      return;
    }

    setSaving(true);
    try {
      const result = await mockCreateGroup({
        name: formData.name,
        date: new Date(formData.date).toISOString(),
      });

      if (result) {
        router.push(`/${locale}/admin/groups/${result.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb
          items={[
            { label: "Election Groups", href: `/${locale}/admin/groups` },
            { label: "New Group" },
          ]}
        />
        <h1 className="mt-2 text-2xl font-bold">Create Election Group</h1>
        <p className="text-muted-foreground">
          Create a new group to organize related elections
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
            <CardDescription>
              Enter the basic information for this election group
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Kirchenwahl 2025"
                required
              />
              <p className="text-xs text-muted-foreground">
                Choose a descriptive name for this group of elections
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Election Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                The date when all elections in this group will take place
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
