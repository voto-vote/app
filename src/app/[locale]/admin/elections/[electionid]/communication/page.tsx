"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Plus, Edit, Trash2, Mail } from "lucide-react";
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
import { Breadcrumb, StatusBadge } from "@/components/admin";
import { mockGetEmailTemplates, mockSendReminders } from "@/actions/admin";
import type { EmailTemplate } from "@/types/admin";

export default function CommunicationPage() {
  const params = useParams();
  const locale = useLocale();
  const electionId = params.electionid as string;

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockGetEmailTemplates(parseInt(electionId));
        setTemplates(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [electionId]);

  const handleSendReminders = async () => {
    await mockSendReminders({
      type: "party-agent",
      recipientIds: [1, 2, 3],
      templateId: selectedTemplate?.id || "",
    });
    setSendDialogOpen(false);
    alert("Reminders sent successfully!");
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
              { label: "Communication" },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold">Communication</h1>
          <p className="text-muted-foreground">
            Manage email templates and send messages
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send Reminders</CardTitle>
            <CardDescription>
              Remind parties and candidates to complete their answers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setSelectedTemplate(
                  templates.find((t) => t.name === "Reminder") || null,
                );
                setSendDialogOpen(true);
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Reminder Emails
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Support Message</CardTitle>
            <CardDescription>
              Send a custom message to specific recipients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Compose Message
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>
            Customize the emails sent to parties and candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{template.name}</h4>
                    <StatusBadge
                      variant={template.isDefault ? "info" : "default"}
                    >
                      {template.isDefault ? "Default" : "Custom"}
                    </StatusBadge>
                    <StatusBadge variant="purple">
                      {template.type.replace("-", " ")}
                    </StatusBadge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Subject: {template.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Placeholders:{" "}
                    {template.placeholders.map((p) => p.key).join(", ")}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!template.isDefault && (
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Edit Dialog */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={() => setSelectedTemplate(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Customize the email template content
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input defaultValue={selectedTemplate.subject} />
              </div>
              <div className="space-y-2">
                <Label>Body (HTML)</Label>
                <Textarea
                  defaultValue={selectedTemplate.body}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Available Placeholders</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.placeholders.map((p) => (
                    <code
                      key={p.key}
                      className="rounded bg-muted px-2 py-1 text-xs"
                      title={p.description}
                    >
                      {`{{${p.key}}}`}
                    </code>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setSelectedTemplate(null)}>
                  Save Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Reminders Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Reminder Emails</DialogTitle>
            <DialogDescription>
              Send reminders to parties and candidates who haven&apos;t
              completed their answers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              This will send reminder emails to all parties and candidates who
              have outstanding thesis answers.
            </p>
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-medium">Recipients</p>
              <p className="text-sm text-muted-foreground">
                3 parties, 5 candidates with incomplete answers
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSendDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSendReminders}>
                <Mail className="mr-2 h-4 w-4" />
                Send Reminders
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
