"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Save } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Breadcrumb } from "@/components/admin";
import { mockCreateElection, mockGetGroups } from "@/actions/admin";
import type {
  ElectionType,
  LocationType,
  CreateElectionRequest,
} from "@/types/admin";
import { useEffect } from "react";
import type { ElectionGroup } from "@/types/admin";

export default function NewElectionPage() {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<ElectionGroup[]>([]);

  // Form state
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [electionDate, setElectionDate] = useState("");
  const [electionType, setElectionType] = useState<ElectionType>(
    "candidates-and-parties",
  );
  const [locationType, setLocationType] = useState<LocationType>("city");
  const [location, setLocation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isCompanyElection, setIsCompanyElection] = useState(false);
  const [groupId, setGroupId] = useState<string>("none");
  const [defaultLocale, setDefaultLocale] = useState("de");

  useEffect(() => {
    const loadGroups = async () => {
      const data = await mockGetGroups();
      setGroups(data);
    };
    loadGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: CreateElectionRequest = {
        groupId: groupId && groupId !== "none" ? parseInt(groupId) : undefined,
        name,
        title,
        subtitle,
        description,
        electionDate,
        electionType,
        stage: "created",
        locationType: isCompanyElection ? "custom" : locationType,
        location: isCompanyElection ? "" : location,
        companyName: isCompanyElection ? companyName : undefined,
        supportedLocales: [defaultLocale],
        defaultLocale,
        settings: {
          faq: [],
          survey: {},
          thesisOrder: "random",
          requireTranslationApproval: true,
          theming: {
            primaryColor: "oklch(44.7038% 0.24 331.12)",
          },
          algorithm: {
            decisions: 5,
            matchType: electionType,
            weightedVotesLimit: false,
            matrix: [],
            liveMatchesVisible: true,
          },
          matchFields: [],
        },
      };

      const election = await mockCreateElection(data);
      router.push(`/${locale}/admin/elections/${election.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb
          items={[
            { label: "Elections", href: `/${locale}/admin/elections` },
            { label: "New Election" },
          ]}
        />
        <div className="mt-2 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Election</h1>
            <p className="text-muted-foreground">
              Set up a new election or voting process
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for this election
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Election Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Kirchenwahl Ulm 2025"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Election Group</Label>
                <Select value={groupId} onValueChange={setGroupId}>
                  <SelectTrigger>
                    <SelectValue placeholder="No group (standalone)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No group (standalone)</SelectItem>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Display Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Kirchenwahl 2025"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g., Ulm und Göppingen"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the election..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="electionDate">Election Date *</Label>
                <Input
                  id="electionDate"
                  type="date"
                  value={electionDate}
                  onChange={(e) => setElectionDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="electionType">Election Type *</Label>
                <Select
                  value={electionType}
                  onValueChange={(v) => setElectionType(v as ElectionType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parties">Parties only</SelectItem>
                    <SelectItem value="candidates">Candidates only</SelectItem>
                    <SelectItem value="candidates-and-parties">
                      Candidates and Parties
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>
              Where does this election take place?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="company-election"
                checked={isCompanyElection}
                onCheckedChange={setIsCompanyElection}
              />
              <Label htmlFor="company-election">
                This is a company/organization election
              </Label>
            </div>

            {isCompanyElection ? (
              <div className="space-y-2">
                <Label htmlFor="companyName">Company/Organization Name *</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., ACME Corporation"
                  required={isCompanyElection}
                />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="locationType">Location Type *</Label>
                  <Select
                    value={locationType}
                    onValueChange={(v) => setLocationType(v as LocationType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="country">Country</SelectItem>
                      <SelectItem value="state">State (Bundesland)</SelectItem>
                      <SelectItem value="county">County (Landkreis)</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                      <SelectItem value="custom" disabled>
                        Custom area (Coming soon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location Name *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Ulm, Stuttgart"
                    required={!isCompanyElection}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>
              Set the default language for this election
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="defaultLocale">Default Language *</Label>
              <Select value={defaultLocale} onValueChange={setDefaultLocale}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">German (Deutsch)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French (Français)</SelectItem>
                  <SelectItem value="es">Spanish (Español)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Additional languages can be added after creation
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Create Election
          </Button>
        </div>
      </form>
    </div>
  );
}
