"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  FileText,
  Building2,
  Users,
  Mail,
  Settings,
  Download,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  StageStepper,
  ElectionStageBadge,
} from "@/components/admin";
import { useAdminElectionStore } from "@/stores/admin";
import {
  mockGetElection,
  mockUpdateElection,
  mockChangeElectionStage,
} from "@/actions/admin";
import type { AdminElection, ElectionStage } from "@/types/admin";

export default function ElectionOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const electionId = params.electionid as string;

  const { currentElection, setCurrentElection, canTransitionTo } =
    useAdminElectionStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const loadElection = async () => {
      try {
        const data = await mockGetElection(parseInt(electionId));
        if (data) {
          setCurrentElection(data);
          setName(data.name);
          setTitle(data.title);
          setSubtitle(data.subtitle);
          setDescription(data.description);
        }
      } finally {
        setLoading(false);
      }
    };

    loadElection();
  }, [electionId, setCurrentElection]);

  const handleSave = async () => {
    if (!currentElection) return;

    setSaving(true);
    try {
      const updated = await mockUpdateElection(currentElection.id, {
        name,
        title,
        subtitle,
        description,
      });
      if (updated) {
        setCurrentElection(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (newStage: ElectionStage) => {
    if (!currentElection) return;

    if (
      confirm(
        `Are you sure you want to change the election stage to "${newStage}"? This action may be irreversible.`,
      )
    ) {
      try {
        const updated = await mockChangeElectionStage(
          currentElection.id,
          newStage,
        );
        if (updated) {
          setCurrentElection(updated);
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : "Stage change failed");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!currentElection) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Election not found</p>
        <Button asChild>
          <Link href={`/${locale}/admin/elections`}>Back to Elections</Link>
        </Button>
      </div>
    );
  }

  const quickLinks = [
    {
      href: `/${locale}/admin/elections/${electionId}/theses`,
      icon: FileText,
      label: "Theses",
      description: "Manage election theses",
    },
    {
      href: `/${locale}/admin/elections/${electionId}/parties`,
      icon: Building2,
      label: "Parties",
      description: "Manage political parties",
    },
    {
      href: `/${locale}/admin/elections/${electionId}/candidates`,
      icon: Users,
      label: "Candidates",
      description: "Manage candidates",
    },
    {
      href: `/${locale}/admin/elections/${electionId}/invitations`,
      icon: Mail,
      label: "Invitations",
      description: "Send and manage invitations",
    },
    {
      href: `/${locale}/admin/elections/${electionId}/settings`,
      icon: Settings,
      label: "Settings",
      description: "FAQ, Survey, Theme",
    },
    {
      href: `/${locale}/admin/elections/${electionId}/export`,
      icon: Download,
      label: "Export",
      description: "Export election data",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb
          items={[
            { label: "Elections", href: `/${locale}/admin/elections` },
            { label: currentElection.name },
          ]}
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{currentElection.name}</h1>
                <ElectionStageBadge stage={currentElection.stage} />
              </div>
              <p className="text-muted-foreground">
                {currentElection.location} &middot;{" "}
                {currentElection.electionDate}
              </p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Stage Stepper */}
      <Card>
        <CardHeader>
          <CardTitle>Election Stage</CardTitle>
          <CardDescription>Current progress of this election</CardDescription>
        </CardHeader>
        <CardContent>
          <StageStepper
            currentStage={currentElection.stage}
            onStageClick={handleStageChange}
            canTransition={canTransitionTo}
          />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Card
            key={link.href}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            asChild
          >
            <Link href={link.href}>
              <CardHeader className="flex flex-row items-center gap-4">
                <link.icon className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-lg">{link.label}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </div>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>

      {/* Basic Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Edit the basic details of this election
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Election Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Display Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pending Change Requests Alert */}
      <Card className="border-warning">
        <CardHeader className="flex flex-row items-center gap-4">
          <AlertCircle className="h-6 w-6 text-warning" />
          <div>
            <CardTitle>Pending Change Requests</CardTitle>
            <CardDescription>
              2 change requests are waiting for your review
            </CardDescription>
          </div>
          <Button variant="outline" className="ml-auto" asChild>
            <Link
              href={`/${locale}/admin/elections/${electionId}/change-requests`}
            >
              Review Requests
            </Link>
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
