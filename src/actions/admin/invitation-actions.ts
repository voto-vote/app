"use server";

import type {
  Invitation,
  EmailTemplate,
  SendInvitationRequest,
  ReminderRequest,
  InvitationType,
} from "@/types/admin";
import {
  simulateDelay,
  generateId,
  now,
  daysFromNow,
} from "@/lib/admin/mock-utils";
import { mockInvitations, mockEmailTemplates } from "@/lib/admin/mock-data";

// In-memory stores
let invitations = [...mockInvitations];
let templates = [...mockEmailTemplates];

export async function mockGetInvitations(
  electionId: number,
): Promise<Invitation[]> {
  await simulateDelay(300);
  return invitations.filter((i) => i.electionId === electionId);
}

export async function mockGetInvitation(
  id: string,
): Promise<Invitation | null> {
  await simulateDelay(200);
  return invitations.find((i) => i.id === id) || null;
}

export async function mockSendInvitations(
  request: SendInvitationRequest,
): Promise<{ sent: number; failed: number }> {
  await simulateDelay(600);

  let sent = 0;
  let failed = 0;

  for (const recipientId of request.recipientIds) {
    try {
      const newInvitation: Invitation = {
        id: generateId(),
        type: request.type,
        electionId: 1, // Would be passed in real implementation
        recipientEmail: `recipient${recipientId}@example.com`,
        recipientName: `Recipient ${recipientId}`,
        targetId: recipientId,
        templateId: request.templateId,
        status: "sent",
        sentAt: now(),
        expiresAt: daysFromNow(30),
        token: generateId(),
      };
      invitations = [...invitations, newInvitation];
      sent++;
    } catch {
      failed++;
    }
  }

  return { sent, failed };
}

export async function mockResendInvitation(
  id: string,
): Promise<Invitation | null> {
  await simulateDelay(300);

  const index = invitations.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const updated: Invitation = {
    ...invitations[index],
    status: "sent",
    sentAt: now(),
    expiresAt: daysFromNow(30),
    token: generateId(),
  };

  invitations = [
    ...invitations.slice(0, index),
    updated,
    ...invitations.slice(index + 1),
  ];
  return updated;
}

export async function mockSendReminders(
  request: ReminderRequest,
): Promise<{ sent: number; failed: number }> {
  await simulateDelay(500);

  // Mock: Simulate sending reminders
  console.log(
    `Mock send reminders to ${request.recipientIds.length} recipients`,
  );

  return { sent: request.recipientIds.length, failed: 0 };
}

export async function mockGetEmailTemplates(
  electionId: number,
): Promise<EmailTemplate[]> {
  await simulateDelay(200);
  return templates.filter((t) => t.electionId === electionId);
}

export async function mockGetEmailTemplate(
  id: string,
): Promise<EmailTemplate | null> {
  await simulateDelay(200);
  return templates.find((t) => t.id === id) || null;
}

export async function mockCreateEmailTemplate(
  data: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">,
): Promise<EmailTemplate> {
  await simulateDelay(400);

  const newTemplate: EmailTemplate = {
    ...data,
    id: generateId(),
    createdAt: now(),
    updatedAt: now(),
  };

  templates = [...templates, newTemplate];
  return newTemplate;
}

export async function mockUpdateEmailTemplate(
  id: string,
  data: Partial<EmailTemplate>,
): Promise<EmailTemplate | null> {
  await simulateDelay(300);

  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updated: EmailTemplate = {
    ...templates[index],
    ...data,
    updatedAt: now(),
  };

  templates = [
    ...templates.slice(0, index),
    updated,
    ...templates.slice(index + 1),
  ];
  return updated;
}

export async function mockDeleteEmailTemplate(id: string): Promise<boolean> {
  await simulateDelay(200);

  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) return false;

  // Don't allow deleting default templates
  if (templates[index].isDefault) {
    throw new Error("Cannot delete default template");
  }

  templates = [...templates.slice(0, index), ...templates.slice(index + 1)];
  return true;
}

export async function mockGetDefaultTemplate(
  electionId: number,
  type: InvitationType,
): Promise<EmailTemplate | null> {
  await simulateDelay(200);
  return (
    templates.find(
      (t) => t.electionId === electionId && t.type === type && t.isDefault,
    ) || null
  );
}
