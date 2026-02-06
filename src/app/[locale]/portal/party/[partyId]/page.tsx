"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Save, Upload, AlertTriangle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  mockGetMyParty,
  mockUpdateMyParty,
  mockRequestChange,
} from "@/actions/admin";
import type { AdminParty } from "@/types/admin";

export default function PartyProfilePage() {
  const params = useParams();
  const locale = useLocale();
  const partyId = parseInt(params.partyId as string);

  const [party, setParty] = useState<AdminParty | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [changeRequestField, setChangeRequestField] = useState("");
  const [changeRequestReason, setChangeRequestReason] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockGetMyParty(partyId);
        if (data) {
          setParty(data);
          setFormData({
            name: data.name,
            shortName: data.shortName || "",
            description: data.description || "",
            website: data.website || "",
            email: data.email || "",
            phone: data.phone || "",
            socialMedia: {
              facebook: data.socialMedia?.facebook || "",
              twitter: data.socialMedia?.twitter || "",
              instagram: data.socialMedia?.instagram || "",
            },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [partyId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await mockUpdateMyParty(partyId, formData);
      if (updated) {
        setParty(updated);
        alert("Profile saved successfully!");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRequestChange = async () => {
    await mockRequestChange({
      type: "party",
      entityId: partyId,
      field: changeRequestField,
      reason: changeRequestReason,
    });
    setChangeRequestOpen(false);
    setChangeRequestField("");
    setChangeRequestReason("");
    alert("Change request submitted! An admin will review your request.");
  };

  const openChangeRequest = (field: string) => {
    setChangeRequestField(field);
    setChangeRequestOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!party) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Party not found.</p>
      </div>
    );
  }

  const isLocked = party.status === "locked" || party.status === "published";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Party Profile</h1>
          <p className="text-muted-foreground">
            Manage your party information and public profile
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving || isLocked}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {isLocked && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-medium">Profile is locked</p>
            <p className="text-sm">
              The election has progressed and your profile is now locked. To
              make changes, you must submit a change request for admin approval.
            </p>
          </div>
        </div>
      )}

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Party Logo</CardTitle>
          <CardDescription>
            Upload your party logo (recommended: 400x400px, PNG or JPG)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed bg-muted">
              {party.logo ? (
                <img
                  src={party.logo}
                  alt={party.name}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {party.shortName || party.name.substring(0, 2)}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Button variant="outline" disabled={isLocked}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              {isLocked && (
                <Button
                  variant="link"
                  size="sm"
                  className="text-yellow-600"
                  onClick={() => openChangeRequest("logo")}
                >
                  Request change
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Your party&apos;s name and description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name">Party Name *</Label>
                {isLocked && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-yellow-600"
                    onClick={() => openChangeRequest("name")}
                  >
                    Request change
                  </Button>
                )}
              </div>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isLocked}
                placeholder="Full party name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name / Abbreviation</Label>
              <Input
                id="shortName"
                value={formData.shortName}
                onChange={(e) =>
                  setFormData({ ...formData, shortName: e.target.value })
                }
                disabled={isLocked}
                placeholder="e.g., CDU, SPD"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              {isLocked && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs text-yellow-600"
                  onClick={() => openChangeRequest("description")}
                >
                  Request change
                </Button>
              )}
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isLocked}
              placeholder="A brief description of your party"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How voters can reach your party</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLocked}
                placeholder="contact@party.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={isLocked}
                placeholder="+49 123 456789"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              disabled={isLocked}
              placeholder="https://www.party.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Your party&apos;s social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.socialMedia.facebook}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: {
                      ...formData.socialMedia,
                      facebook: e.target.value,
                    },
                  })
                }
                disabled={isLocked}
                placeholder="facebook.com/yourparty"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input
                id="twitter"
                value={formData.socialMedia.twitter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: {
                      ...formData.socialMedia,
                      twitter: e.target.value,
                    },
                  })
                }
                disabled={isLocked}
                placeholder="@yourparty"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.socialMedia.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: {
                      ...formData.socialMedia,
                      instagram: e.target.value,
                    },
                  })
                }
                disabled={isLocked}
                placeholder="@yourparty"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Request Dialog */}
      <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Profile Change</DialogTitle>
            <DialogDescription>
              Submit a request to modify locked content. An administrator will
              review your request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Field to change</Label>
              <Input value={changeRequestField} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for change *</Label>
              <Textarea
                id="reason"
                value={changeRequestReason}
                onChange={(e) => setChangeRequestReason(e.target.value)}
                placeholder="Please explain why this change is needed..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setChangeRequestOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestChange}
                disabled={!changeRequestReason}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
