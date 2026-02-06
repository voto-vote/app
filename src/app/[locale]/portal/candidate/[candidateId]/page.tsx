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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  mockGetMyCandidate,
  mockUpdateMyCandidate,
  mockRequestChange,
} from "@/actions/admin";
import type { AdminCandidate } from "@/types/admin";

export default function CandidateProfilePage() {
  const params = useParams();
  const locale = useLocale();
  const candidateId = parseInt(params.candidateId as string);

  const [candidate, setCandidate] = useState<AdminCandidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [changeRequestField, setChangeRequestField] = useState("");
  const [changeRequestReason, setChangeRequestReason] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthYear: "",
    occupation: "",
    biography: "",
    website: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockGetMyCandidate(candidateId);
        if (data) {
          setCandidate(data);
          setFormData({
            title: data.title || "",
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || "",
            birthYear: data.birthYear?.toString() || "",
            occupation: data.occupation || "",
            biography: data.biography || "",
            website: data.website || "",
            socialMedia: {
              facebook: data.socialMedia?.facebook || "",
              twitter: data.socialMedia?.twitter || "",
              instagram: data.socialMedia?.instagram || "",
              linkedin: data.socialMedia?.linkedin || "",
            },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [candidateId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await mockUpdateMyCandidate(candidateId, {
        ...formData,
        birthYear: formData.birthYear
          ? parseInt(formData.birthYear)
          : undefined,
      });
      if (updated) {
        setCandidate(updated);
        alert("Profile saved successfully!");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRequestChange = async () => {
    await mockRequestChange({
      type: "candidate",
      entityId: candidateId,
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

  if (!candidate) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Candidate not found.</p>
      </div>
    );
  }

  const isLocked =
    candidate.status === "voted" || candidate.status === "inactive";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your candidate information and public profile
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

      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>
            Upload your official candidate photo (recommended: 400x400px, PNG or
            JPG)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-dashed bg-muted">
              {candidate.profilePicture ? (
                <img
                  src={candidate.profilePicture}
                  alt={`${candidate.firstName} ${candidate.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-muted-foreground">
                  {candidate.firstName[0]}
                  {candidate.lastName[0]}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Button variant="outline" disabled={isLocked}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 5MB
              </p>
              {isLocked && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-yellow-600"
                  onClick={() => openChangeRequest("profilePicture")}
                >
                  Request change
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your basic information visible to voters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Select
                value={formData.title}
                onValueChange={(value) =>
                  setFormData({ ...formData, title: value })
                }
                disabled={isLocked}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                  <SelectItem value="Prof. Dr.">Prof. Dr.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="firstName">First Name *</Label>
                {isLocked && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-yellow-600"
                    onClick={() => openChangeRequest("firstName")}
                  >
                    Request change
                  </Button>
                )}
              </div>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={isLocked}
                placeholder="Your first name"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lastName">Last Name *</Label>
                {isLocked && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-yellow-600"
                    onClick={() => openChangeRequest("lastName")}
                  >
                    Request change
                  </Button>
                )}
              </div>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={isLocked}
                placeholder="Your last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthYear">Birth Year</Label>
              <Input
                id="birthYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.birthYear}
                onChange={(e) =>
                  setFormData({ ...formData, birthYear: e.target.value })
                }
                disabled={isLocked}
                placeholder="e.g., 1985"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation / Profession</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) =>
                setFormData({ ...formData, occupation: e.target.value })
              }
              disabled={isLocked}
              placeholder="e.g., Attorney, Teacher, Engineer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="biography">Biography</Label>
              {isLocked && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs text-yellow-600"
                  onClick={() => openChangeRequest("biography")}
                >
                  Request change
                </Button>
              )}
            </div>
            <Textarea
              id="biography"
              value={formData.biography}
              onChange={(e) =>
                setFormData({ ...formData, biography: e.target.value })
              }
              disabled={isLocked}
              placeholder="Tell voters about yourself, your background, and your goals..."
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              {formData.biography.length}/1000 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How voters can reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLocked}
                placeholder="your.email@example.com"
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
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              disabled={isLocked}
              placeholder="https://www.yourwebsite.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
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
                placeholder="facebook.com/yourprofile"
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
                placeholder="@yourhandle"
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
                placeholder="@yourhandle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={formData.socialMedia.linkedin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: {
                      ...formData.socialMedia,
                      linkedin: e.target.value,
                    },
                  })
                }
                disabled={isLocked}
                placeholder="linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Party Affiliation */}
      {candidate.partyName && (
        <Card>
          <CardHeader>
            <CardTitle>Party Affiliation</CardTitle>
            <CardDescription>Your affiliated political party</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-bold">
                {candidate.partyName.substring(0, 2)}
              </div>
              <div>
                <p className="font-medium">{candidate.partyName}</p>
                {candidate.district && (
                  <p className="text-sm text-muted-foreground">
                    District: {candidate.district}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
