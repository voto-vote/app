"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Save,
  AlertTriangle,
  MessageSquare,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  mockGetMyTheses,
  mockSubmitCandidateAnswer,
  mockRequestChange,
  mockGetMyCandidate,
} from "@/actions/admin";
import { usePortalStore } from "@/stores/admin";
import type { AdminThesis, AdminCandidate } from "@/types/admin";

type AnswerPosition = "agree" | "neutral" | "disagree" | null;

interface ThesisAnswer {
  position: AnswerPosition;
  explanation: string;
}

export default function CandidateAnswersPage() {
  const params = useParams();
  const locale = useLocale();
  const candidateId = parseInt(params.candidateId as string);

  const { answerDrafts, setAnswerDraft, clearAnswerDrafts } = usePortalStore();
  const [candidate, setCandidate] = useState<AdminCandidate | null>(null);
  const [theses, setTheses] = useState<AdminThesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, ThesisAnswer>>({});
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [changeRequestReason, setChangeRequestReason] = useState("");
  const [showPartyAnswer, setShowPartyAnswer] = useState(false);

  // Mock party answers for reference
  const mockPartyAnswers: Record<number, ThesisAnswer> = {
    1: { position: "agree", explanation: "Our party supports this because..." },
    2: { position: "disagree", explanation: "We believe otherwise..." },
    3: { position: "neutral", explanation: "This requires more discussion..." },
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [candidateData, thesesData] = await Promise.all([
          mockGetMyCandidate(candidateId),
          mockGetMyTheses(1), // Mock election ID
        ]);
        setCandidate(candidateData);
        setTheses(thesesData);

        // Initialize answers from mock data
        const initialAnswers: Record<number, ThesisAnswer> = {};
        thesesData.forEach((thesis) => {
          const draft = answerDrafts[thesis.id];
          if (draft) {
            initialAnswers[thesis.id] = draft as ThesisAnswer;
          } else {
            initialAnswers[thesis.id] = {
              position: null,
              explanation: "",
            };
          }
        });
        setAnswers(initialAnswers);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [candidateId, answerDrafts]);

  const currentThesis = theses[currentIndex];
  const currentAnswer = currentThesis ? answers[currentThesis.id] : null;
  const partyAnswer = currentThesis ? mockPartyAnswers[currentThesis.id] : null;

  const answeredCount = Object.values(answers).filter(
    (a) => a.position !== null,
  ).length;
  const progressPercent =
    theses.length > 0 ? Math.round((answeredCount / theses.length) * 100) : 0;

  const updateAnswer = (field: keyof ThesisAnswer, value: unknown) => {
    if (!currentThesis) return;

    const newAnswer = {
      ...answers[currentThesis.id],
      [field]: value,
    };
    setAnswers({
      ...answers,
      [currentThesis.id]: newAnswer,
    });

    setAnswerDraft(currentThesis.id, newAnswer);
  };

  const copyFromParty = () => {
    if (!currentThesis || !partyAnswer) return;

    const newAnswer = {
      position: partyAnswer.position,
      explanation: partyAnswer.explanation,
    };
    setAnswers({
      ...answers,
      [currentThesis.id]: newAnswer,
    });
    setAnswerDraft(currentThesis.id, newAnswer);
  };

  const handleSaveAnswer = async () => {
    if (!currentThesis || !currentAnswer?.position) return;

    setSaving(true);
    try {
      await mockSubmitCandidateAnswer(candidateId, currentThesis.id, {
        position: currentAnswer.position,
        explanation: currentAnswer.explanation,
      });
      alert("Answer saved!");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllAnswers = async () => {
    setSaving(true);
    try {
      for (const thesis of theses) {
        const answer = answers[thesis.id];
        if (answer?.position) {
          await mockSubmitCandidateAnswer(candidateId, thesis.id, answer);
        }
      }
      clearAnswerDrafts();
      alert("All answers saved successfully!");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestChange = async () => {
    if (!currentThesis) return;

    await mockRequestChange({
      type: "answer",
      entityId: candidateId,
      field: `thesis-${currentThesis.id}`,
      reason: changeRequestReason,
    });
    setChangeRequestOpen(false);
    setChangeRequestReason("");
    alert("Change request submitted!");
  };

  const goToNext = () => {
    if (currentIndex < theses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (theses.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">No theses available yet.</p>
        <Button asChild className="mt-4">
          <Link href={`/${locale}/portal`}>Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const isLocked = currentThesis?.isLocked;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Answer Theses</h1>
          <p className="text-muted-foreground">
            Provide your position on each thesis
          </p>
        </div>
        <Button onClick={handleSaveAllAnswers} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          Save All Answers
        </Button>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <span>
              {answeredCount} of {theses.length} theses answered
            </span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="mt-2 h-2" />
        </CardContent>
      </Card>

      {/* Thesis Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1 overflow-x-auto">
          {theses.map((thesis, index) => (
            <button
              key={thesis.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-8 w-8 flex-shrink-0 rounded-full text-xs font-medium transition-colors ${
                index === currentIndex
                  ? "bg-primary text-primary-foreground"
                  : answers[thesis.id]?.position
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={goToNext}
          disabled={currentIndex === theses.length - 1}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Current Thesis */}
      {currentThesis && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Thesis {currentIndex + 1}
                  {currentAnswer?.position && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  Category: {currentThesis.category || "General"}
                </CardDescription>
              </div>
              {isLocked && (
                <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                  <AlertTriangle className="h-3 w-3" />
                  Locked
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Thesis Text */}
            <div className="rounded-lg bg-muted p-4">
              <p className="text-lg font-medium">{currentThesis.title}</p>
              {currentThesis.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {currentThesis.description}
                </p>
              )}
            </div>

            {/* Party Answer Reference */}
            {candidate?.partyId && partyAnswer && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-800">
                    {candidate.partyName}&apos;s Position
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPartyAnswer(!showPartyAnswer)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {showPartyAnswer ? "Hide" : "Show"}
                    </button>
                    {!isLocked && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={copyFromParty}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Copy
                      </Button>
                    )}
                  </div>
                </div>
                {showPartyAnswer && (
                  <div className="mt-2 text-sm text-blue-700">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                      style={{
                        backgroundColor:
                          partyAnswer.position === "agree"
                            ? "#dcfce7"
                            : partyAnswer.position === "disagree"
                              ? "#fee2e2"
                              : "#f3f4f6",
                        color:
                          partyAnswer.position === "agree"
                            ? "#166534"
                            : partyAnswer.position === "disagree"
                              ? "#991b1b"
                              : "#374151",
                      }}
                    >
                      {partyAnswer.position}
                    </span>
                    {partyAnswer.explanation && (
                      <p className="mt-1">{partyAnswer.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {isLocked && (
              <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <p>
                  This answer is locked. To make changes, submit a change
                  request.
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="ml-auto h-auto p-0 text-yellow-700"
                  onClick={() => setChangeRequestOpen(true)}
                >
                  Request Change
                </Button>
              </div>
            )}

            {/* Position Selection */}
            <div className="space-y-2">
              <Label>Your Position *</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "agree", label: "Agree", color: "green" },
                  { value: "neutral", label: "Neutral", color: "gray" },
                  { value: "disagree", label: "Disagree", color: "red" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateAnswer("position", option.value as AnswerPosition)
                    }
                    disabled={isLocked}
                    className={`rounded-lg border-2 p-4 text-center transition-colors ${
                      currentAnswer?.position === option.value
                        ? option.color === "green"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : option.color === "red"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-500 bg-gray-50 text-gray-700"
                        : "border-muted hover:border-muted-foreground/30"
                    } ${isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  >
                    <span className="text-2xl">
                      {option.value === "agree"
                        ? "👍"
                        : option.value === "disagree"
                          ? "👎"
                          : "🤷"}
                    </span>
                    <p className="mt-2 font-medium">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-2">
              <Label htmlFor="explanation">
                Explanation (Optional)
                <span className="ml-2 text-xs text-muted-foreground">
                  Why do you hold this position?
                </span>
              </Label>
              <Textarea
                id="explanation"
                value={currentAnswer?.explanation || ""}
                onChange={(e) => updateAnswer("explanation", e.target.value)}
                disabled={isLocked}
                placeholder="Provide additional context for voters..."
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t pt-4">
              <Button
                variant="outline"
                onClick={handleSaveAnswer}
                disabled={saving || !currentAnswer?.position || isLocked}
              >
                <Save className="mr-2 h-4 w-4" />
                Save This Answer
              </Button>
              <Button
                onClick={() => {
                  handleSaveAnswer();
                  goToNext();
                }}
                disabled={
                  saving ||
                  !currentAnswer?.position ||
                  currentIndex === theses.length - 1 ||
                  isLocked
                }
              >
                Save & Continue
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answers Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Answers Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {theses.map((thesis, index) => {
              const answer = answers[thesis.id];
              const pAnswer = mockPartyAnswers[thesis.id];
              const matchesParty =
                pAnswer && answer?.position === pAnswer.position;

              return (
                <button
                  key={thesis.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                    index === currentIndex ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      answer?.position
                        ? answer.position === "agree"
                          ? "bg-green-100 text-green-700"
                          : answer.position === "disagree"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {answer?.position
                      ? answer.position === "agree"
                        ? "👍"
                        : answer.position === "disagree"
                          ? "👎"
                          : "🤷"
                      : index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {thesis.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {answer?.position
                          ? answer.position.charAt(0).toUpperCase() +
                            answer.position.slice(1)
                          : "Not answered"}
                      </p>
                      {matchesParty && (
                        <span className="text-xs text-blue-600">= Party</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Change Request Dialog */}
      <Dialog open={changeRequestOpen} onOpenChange={setChangeRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Answer Change</DialogTitle>
            <DialogDescription>
              Submit a request to modify your locked answer. An administrator
              will review your request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">Thesis:</p>
              <p className="text-sm text-muted-foreground">
                {currentThesis?.title}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="changeReason">Reason for change *</Label>
              <Textarea
                id="changeReason"
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
