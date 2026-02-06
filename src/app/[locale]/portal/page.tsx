"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { FileText, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAdminAuthStore } from "@/stores/admin";
import {
  mockGetMyParty,
  mockGetMyTheses,
  mockGetMyCandidate,
} from "@/actions/admin";
import type { AdminParty, AdminCandidate, AdminThesis } from "@/types/admin";

export default function PortalDashboard() {
  const locale = useLocale();
  const { user } = useAdminAuthStore();
  const [loading, setLoading] = useState(true);
  const [party, setParty] = useState<AdminParty | null>(null);
  const [candidate, setCandidate] = useState<AdminCandidate | null>(null);
  const [theses, setTheses] = useState<AdminThesis[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        if (user.role === "partyadmin" && user.partyIds?.[0]) {
          const [partyData, thesesData] = await Promise.all([
            mockGetMyParty(user.partyIds[0]),
            mockGetMyTheses(user.partyIds[0]),
          ]);
          setParty(partyData);
          setTheses(thesesData);
        } else if (user.role === "candidate" && user.candidateIds?.[0]) {
          const candidateData = await mockGetMyCandidate(user.candidateIds[0]);
          setCandidate(candidateData);
          // For candidates, use election theses
          const thesesData = await mockGetMyTheses(1); // Mock election ID
          setTheses(thesesData);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isPartyAdmin = user?.role === "partyadmin";
  const entityId = isPartyAdmin ? user?.partyIds?.[0] : user?.candidateIds?.[0];
  const entityName = isPartyAdmin
    ? party?.name
    : `${candidate?.firstName} ${candidate?.lastName}`;
  const answerProgress = isPartyAdmin
    ? party?.answerProgress
    : candidate?.answerProgress;
  const profilePath = isPartyAdmin
    ? `/${locale}/portal/party/${entityId}`
    : `/${locale}/portal/candidate/${entityId}`;
  const answersPath = isPartyAdmin
    ? `/${locale}/portal/party/${entityId}/answers`
    : `/${locale}/portal/candidate/${entityId}/answers`;

  const completedAnswers = answerProgress?.answered || 0;
  const totalTheses = answerProgress?.total || theses.length || 10;
  const progressPercent =
    totalTheses > 0 ? Math.round((completedAnswers / totalTheses) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {entityName || user?.name}
        </h1>
        <p className="text-muted-foreground">
          {isPartyAdmin
            ? "Manage your party profile and answer theses for the election."
            : "Complete your candidate profile and answer theses for the election."}
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Thesis Answer Progress
          </CardTitle>
          <CardDescription>
            Track your progress in answering all theses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>
              {completedAnswers} of {totalTheses} theses answered
            </span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />

          <div className="grid gap-4 pt-2 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">{completedAnswers}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">
                  {totalTheses - completedAnswers}
                </p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">5 days</p>
                <p className="text-xs text-muted-foreground">Until deadline</p>
              </div>
            </div>
          </div>

          <Button asChild className="mt-4 w-full">
            <Link href={answersPath}>Continue Answering Theses</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {isPartyAdmin ? "Party Profile" : "My Profile"}
            </CardTitle>
            <CardDescription>
              {isPartyAdmin
                ? "Update your party information and settings"
                : "Update your candidate profile and photo"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href={profilePath}>Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Answer Theses
            </CardTitle>
            <CardDescription>
              Provide your positions on the election theses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href={answersPath}>View Theses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Important updates and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <div className="rounded-full bg-blue-100 p-2">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New thesis added</p>
                <p className="text-xs text-muted-foreground">
                  A new thesis &quot;Climate Policy&quot; has been added to the
                  election.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <div className="rounded-full bg-yellow-100 p-2">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Deadline reminder</p>
                <p className="text-xs text-muted-foreground">
                  5 days remaining to complete all thesis answers.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Profile approved</p>
                <p className="text-xs text-muted-foreground">
                  Your {isPartyAdmin ? "party" : "candidate"} profile has been
                  approved.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
