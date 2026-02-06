"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Wand2,
  Import,
  Lock,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  TranslationStatusBadge,
  StatusBadge,
} from "@/components/admin";
import {
  mockGetTheses,
  mockDeleteThesis,
  mockGetPremadeThesesPool,
  mockImportFromPool,
  mockCheckGrammar,
} from "@/actions/admin";
import type {
  AdminThesis,
  PremadeThesis,
  AIGrammarSuggestion,
} from "@/types/admin";

export default function ThesesManagementPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const electionId = params.electionid as string;

  const [theses, setTheses] = useState<AdminThesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [poolDialogOpen, setPoolDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [poolTheses, setPoolTheses] = useState<PremadeThesis[]>([]);
  const [selectedPoolIds, setSelectedPoolIds] = useState<string[]>([]);
  const [selectedThesisForAI, setSelectedThesisForAI] =
    useState<AdminThesis | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<AIGrammarSuggestion | null>(
    null,
  );
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockGetTheses(parseInt(electionId));
        setTheses(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [electionId]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this thesis?")) {
      try {
        await mockDeleteThesis(id);
        setTheses(theses.filter((t) => t.id !== id));
      } catch (error) {
        alert(error instanceof Error ? error.message : "Delete failed");
      }
    }
  };

  const handleOpenPoolDialog = async () => {
    const pool = await mockGetPremadeThesesPool();
    setPoolTheses(pool);
    setPoolDialogOpen(true);
  };

  const handleImportFromPool = async () => {
    if (selectedPoolIds.length === 0) return;

    const imported = await mockImportFromPool(
      parseInt(electionId),
      selectedPoolIds,
    );
    setTheses([...theses, ...imported]);
    setPoolDialogOpen(false);
    setSelectedPoolIds([]);
  };

  const handleAICheck = async (thesis: AdminThesis) => {
    setSelectedThesisForAI(thesis);
    setAiDialogOpen(true);
    setAiLoading(true);

    try {
      const text = thesis.translations[0]?.text || "";
      const suggestion = await mockCheckGrammar(text);
      setAiSuggestion(suggestion);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb
            items={[
              { label: "Elections", href: `/${locale}/admin/elections` },
              {
                label: `#${electionId}`,
                href: `/${locale}/admin/elections/${electionId}`,
              },
              { label: "Theses" },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold">Thesis Management</h1>
          <p className="text-muted-foreground">
            Manage the theses for this election
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenPoolDialog}>
            <Import className="mr-2 h-4 w-4" />
            Import from Pool
          </Button>
          <Button asChild>
            <Link href={`/${locale}/admin/elections/${electionId}/theses/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Thesis
            </Link>
          </Button>
        </div>
      </div>

      {/* Theses List */}
      <Card>
        <CardHeader>
          <CardTitle>Theses ({theses.length})</CardTitle>
          <CardDescription>
            Drag to reorder. Click the AI button to check grammar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {theses.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No theses yet. Add your first thesis or import from the pool.
            </p>
          ) : (
            <div className="space-y-2">
              {theses.map((thesis, index) => (
                <div
                  key={thesis.id}
                  className="flex items-start gap-3 rounded-lg border p-4"
                >
                  <button className="mt-1 cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </button>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          {thesis.category && (
                            <StatusBadge variant="purple">
                              {thesis.category}
                            </StatusBadge>
                          )}
                          {thesis.isLocked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="mt-1 text-sm">
                          {thesis.translations[0]?.text || "No text"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Languages className="h-3 w-3" />
                        {thesis.translations.map((t) => (
                          <span key={t.id} className="flex items-center gap-1">
                            <span className="uppercase">{t.languageCode}</span>
                            {t.isAutoTranslated && (
                              <TranslationStatusBadge
                                status={t.approvalStatus}
                              />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAICheck(thesis)}
                      disabled={thesis.isLocked}
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      disabled={thesis.isLocked}
                    >
                      <Link
                        href={`/${locale}/admin/elections/${electionId}/theses/${thesis.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(thesis.id)}
                      disabled={thesis.isLocked}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pool Import Dialog */}
      <Dialog open={poolDialogOpen} onOpenChange={setPoolDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import from Thesis Pool</DialogTitle>
            <DialogDescription>
              Select commonly used theses to add to your election
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {poolTheses.map((thesis) => (
              <label
                key={thesis.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-accent"
              >
                <input
                  type="checkbox"
                  checked={selectedPoolIds.includes(thesis.id)}
                  onChange={() => {
                    setSelectedPoolIds((prev) =>
                      prev.includes(thesis.id)
                        ? prev.filter((id) => id !== thesis.id)
                        : [...prev, thesis.id],
                    );
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge variant="purple">
                      {thesis.category}
                    </StatusBadge>
                    <span className="text-xs text-muted-foreground">
                      Used {thesis.usageCount} times
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{thesis.translations[0]?.text}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPoolDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleImportFromPool}
              disabled={selectedPoolIds.length === 0}
            >
              Import {selectedPoolIds.length} Theses
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Grammar Check Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Grammar Check</DialogTitle>
            <DialogDescription>
              Review the AI suggestions for this thesis
            </DialogDescription>
          </DialogHeader>
          {aiLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : aiSuggestion ? (
            <div className="space-y-4">
              {aiSuggestion.hasDoubleNegation && (
                <div className="rounded-md bg-warning/10 p-3 text-sm text-warning">
                  {aiSuggestion.doubleNegationDetails}
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground">
                  Original
                </Label>
                <p className="mt-1 rounded-md bg-muted p-3 text-sm">
                  {aiSuggestion.original}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Suggestion
                </Label>
                <p className="mt-1 rounded-md bg-green-50 p-3 text-sm dark:bg-green-950">
                  {aiSuggestion.suggestion}
                </p>
              </div>
              {aiSuggestion.changes.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Changes made ({aiSuggestion.changes.length})
                  </Label>
                  <ul className="mt-1 space-y-1 text-xs">
                    {aiSuggestion.changes.map((change, i) => (
                      <li key={i} className="text-muted-foreground">
                        {change.type}:{" "}
                        <span className="line-through">
                          {change.originalText}
                        </span>{" "}
                        →{" "}
                        <span className="text-green-600">
                          {change.suggestedText}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAiDialogOpen(false)}
                >
                  Reject
                </Button>
                <Button onClick={() => setAiDialogOpen(false)}>
                  Accept Changes
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Label component for the AI dialog
function Label({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={className}>{children}</p>;
}
