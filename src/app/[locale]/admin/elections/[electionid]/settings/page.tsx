"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Save,
  HelpCircle,
  ClipboardList,
  Megaphone,
  Plus,
  Trash2,
  GripVertical,
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumb } from "@/components/admin";
import { mockGetElection, mockUpdateElection } from "@/actions/admin";
import type { AdminElection } from "@/types/admin";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface SurveyQuestion {
  id: string;
  question: string;
  type: "text" | "rating" | "choice";
  options?: string[];
}

export default function SettingsPage() {
  const params = useParams();
  const locale = useLocale();
  const electionId = params.electionid as string;

  const [election, setElection] = useState<AdminElection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FAQ State
  const [faqEnabled, setFaqEnabled] = useState(false);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  // Survey State
  const [surveyEnabled, setSurveyEnabled] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState("Your Feedback");
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);

  // CTA State
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("");
  const [ctaButtonUrl, setCtaButtonUrl] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockGetElection(parseInt(electionId));
        if (data) {
          setElection(data);

          // Load settings from election data
          const settings = data.settings;
          if (settings) {
            // FAQ
            setFaqEnabled(settings.faqEnabled || false);
            setFaqItems(
              settings.faqItems || [
                {
                  id: "1",
                  question: "What is this election about?",
                  answer: "This election allows you to...",
                },
                {
                  id: "2",
                  question: "How are results calculated?",
                  answer: "Results are calculated using...",
                },
              ],
            );

            // Survey
            setSurveyEnabled(settings.surveyEnabled || false);
            setSurveyTitle(settings.surveyTitle || "Your Feedback");
            setSurveyQuestions(
              settings.surveyQuestions || [
                {
                  id: "1",
                  question: "How did you hear about this tool?",
                  type: "choice",
                  options: ["Social Media", "Friend", "News", "Other"],
                },
              ],
            );

            // CTA
            setCtaEnabled(settings.ctaEnabled || false);
            setCtaTitle(settings.ctaTitle || "");
            setCtaDescription(settings.ctaDescription || "");
            setCtaButtonText(settings.ctaButtonText || "");
            setCtaButtonUrl(settings.ctaButtonUrl || "");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [electionId]);

  const handleSave = async () => {
    if (!election) return;

    setSaving(true);
    try {
      await mockUpdateElection(parseInt(electionId), {
        settings: {
          ...election.settings,
          faqEnabled,
          faqItems,
          surveyEnabled,
          surveyTitle,
          surveyQuestions,
          ctaEnabled,
          ctaTitle,
          ctaDescription,
          ctaButtonText,
          ctaButtonUrl,
        },
      });
      alert("Settings saved successfully!");
    } finally {
      setSaving(false);
    }
  };

  // FAQ Helpers
  const addFaqItem = () => {
    setFaqItems([
      ...faqItems,
      { id: Date.now().toString(), question: "", answer: "" },
    ]);
  };

  const updateFaqItem = (
    id: string,
    field: "question" | "answer",
    value: string,
  ) => {
    setFaqItems(
      faqItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const removeFaqItem = (id: string) => {
    setFaqItems(faqItems.filter((item) => item.id !== id));
  };

  // Survey Helpers
  const addSurveyQuestion = () => {
    setSurveyQuestions([
      ...surveyQuestions,
      { id: Date.now().toString(), question: "", type: "text" },
    ]);
  };

  const updateSurveyQuestion = (
    id: string,
    field: keyof SurveyQuestion,
    value: unknown,
  ) => {
    setSurveyQuestions(
      surveyQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const removeSurveyQuestion = (id: string) => {
    setSurveyQuestions(surveyQuestions.filter((q) => q.id !== id));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Election not found.</p>
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
              { label: "Settings" },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold">Election Settings</h1>
          <p className="text-muted-foreground">
            Configure FAQ, survey, and call-to-action for this election
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="survey" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Survey
          </TabsTrigger>
          <TabsTrigger value="cta" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Call-to-Action
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Add common questions and answers for voters
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="faq-enabled">Enable FAQ</Label>
                  <Switch
                    id="faq-enabled"
                    checked={faqEnabled}
                    onCheckedChange={setFaqEnabled}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!faqEnabled ? (
                <p className="py-8 text-center text-muted-foreground">
                  Enable FAQ to add questions and answers
                </p>
              ) : (
                <>
                  <Accordion type="multiple" className="space-y-2">
                    {faqItems.map((item, index) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="rounded-lg border px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <span className="text-left">
                              {item.question || `Question ${index + 1}`}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label>Question</Label>
                            <Input
                              value={item.question}
                              onChange={(e) =>
                                updateFaqItem(
                                  item.id,
                                  "question",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter the question..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Answer</Label>
                            <Textarea
                              value={item.answer}
                              onChange={(e) =>
                                updateFaqItem(item.id, "answer", e.target.value)
                              }
                              placeholder="Enter the answer..."
                              rows={3}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => removeFaqItem(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Question
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button variant="outline" onClick={addFaqItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Survey Tab */}
        <TabsContent value="survey">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Post-Result Survey</CardTitle>
                  <CardDescription>
                    Collect feedback from voters after they see their results
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="survey-enabled">Enable Survey</Label>
                  <Switch
                    id="survey-enabled"
                    checked={surveyEnabled}
                    onCheckedChange={setSurveyEnabled}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!surveyEnabled ? (
                <p className="py-8 text-center text-muted-foreground">
                  Enable survey to collect voter feedback
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="survey-title">Survey Title</Label>
                    <Input
                      id="survey-title"
                      value={surveyTitle}
                      onChange={(e) => setSurveyTitle(e.target.value)}
                      placeholder="e.g., Tell us what you think!"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Questions</Label>
                    {surveyQuestions.map((question, index) => (
                      <div
                        key={question.id}
                        className="rounded-lg border bg-muted/50 p-4 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium">
                            Question {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSurveyQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Question Text</Label>
                          <Input
                            value={question.question}
                            onChange={(e) =>
                              updateSurveyQuestion(
                                question.id,
                                "question",
                                e.target.value,
                              )
                            }
                            placeholder="Enter your question..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Answer Type</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={question.type}
                            onChange={(e) =>
                              updateSurveyQuestion(
                                question.id,
                                "type",
                                e.target.value,
                              )
                            }
                          >
                            <option value="text">Free Text</option>
                            <option value="rating">Rating (1-5)</option>
                            <option value="choice">Multiple Choice</option>
                          </select>
                        </div>
                        {question.type === "choice" && (
                          <div className="space-y-2">
                            <Label>Options (comma-separated)</Label>
                            <Input
                              value={question.options?.join(", ") || ""}
                              onChange={(e) =>
                                updateSurveyQuestion(
                                  question.id,
                                  "options",
                                  e.target.value
                                    .split(",")
                                    .map((s) => s.trim()),
                                )
                              }
                              placeholder="Option 1, Option 2, Option 3"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" onClick={addSurveyQuestion}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Tab */}
        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Call-to-Action</CardTitle>
                  <CardDescription>
                    Add a promotional banner or action button to the results
                    page
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="cta-enabled">Enable CTA</Label>
                  <Switch
                    id="cta-enabled"
                    checked={ctaEnabled}
                    onCheckedChange={setCtaEnabled}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!ctaEnabled ? (
                <p className="py-8 text-center text-muted-foreground">
                  Enable call-to-action to add a promotional section
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cta-title">Title</Label>
                    <Input
                      id="cta-title"
                      value={ctaTitle}
                      onChange={(e) => setCtaTitle(e.target.value)}
                      placeholder="e.g., Want to learn more?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cta-description">Description</Label>
                    <Textarea
                      id="cta-description"
                      value={ctaDescription}
                      onChange={(e) => setCtaDescription(e.target.value)}
                      placeholder="A brief description or message..."
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cta-button-text">Button Text</Label>
                      <Input
                        id="cta-button-text"
                        value={ctaButtonText}
                        onChange={(e) => setCtaButtonText(e.target.value)}
                        placeholder="e.g., Learn More"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cta-button-url">Button URL</Label>
                      <Input
                        id="cta-button-url"
                        type="url"
                        value={ctaButtonUrl}
                        onChange={(e) => setCtaButtonUrl(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  {ctaTitle && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="rounded-lg border bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                        <h3 className="text-lg font-semibold">{ctaTitle}</h3>
                        {ctaDescription && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {ctaDescription}
                          </p>
                        )}
                        {ctaButtonText && (
                          <Button className="mt-4" size="sm">
                            {ctaButtonText}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
