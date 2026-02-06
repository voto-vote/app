"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        success:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        purple:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type StatusBadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusBadgeVariants> & {
    children: React.ReactNode;
  };

export function StatusBadge({
  className,
  variant,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

// Predefined status mappings
export function ElectionStageBadge({
  stage,
}: {
  stage: "created" | "thesis-entry" | "answering" | "live" | "archived";
}) {
  const config: Record<
    string,
    { label: string; variant: StatusBadgeProps["variant"] }
  > = {
    created: { label: "Created", variant: "default" },
    "thesis-entry": { label: "Thesis Entry", variant: "info" },
    answering: { label: "Answering", variant: "warning" },
    live: { label: "Live", variant: "success" },
    archived: { label: "Archived", variant: "default" },
  };

  const { label, variant } = config[stage] || config.created;

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
}

export function PartyStatusBadge({
  status,
}: {
  status: "created" | "invited" | "active" | "voted" | "deactivated";
}) {
  const config: Record<
    string,
    { label: string; variant: StatusBadgeProps["variant"] }
  > = {
    created: { label: "Created", variant: "default" },
    invited: { label: "Invited", variant: "info" },
    active: { label: "Active", variant: "warning" },
    voted: { label: "Voted", variant: "success" },
    deactivated: { label: "Deactivated", variant: "error" },
  };

  const { label, variant } = config[status] || config.created;

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
}

export function CandidateStatusBadge({
  status,
}: {
  status: "created" | "invited" | "active" | "voted" | "deactivated";
}) {
  return <PartyStatusBadge status={status} />;
}

export function InvitationStatusBadge({
  status,
}: {
  status: "pending" | "sent" | "accepted" | "expired" | "declined";
}) {
  const config: Record<
    string,
    { label: string; variant: StatusBadgeProps["variant"] }
  > = {
    pending: { label: "Pending", variant: "default" },
    sent: { label: "Sent", variant: "info" },
    accepted: { label: "Accepted", variant: "success" },
    expired: { label: "Expired", variant: "error" },
    declined: { label: "Declined", variant: "error" },
  };

  const { label, variant } = config[status] || config.pending;

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
}

export function ChangeRequestStatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  const config: Record<
    string,
    { label: string; variant: StatusBadgeProps["variant"] }
  > = {
    pending: { label: "Pending", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "error" },
  };

  const { label, variant } = config[status] || config.pending;

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
}

export function TranslationStatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  const config: Record<
    string,
    { label: string; variant: StatusBadgeProps["variant"] }
  > = {
    pending: { label: "Pending Review", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "error" },
  };

  const { label, variant } = config[status] || config.pending;

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
}

export function AnswerProgressBadge({
  progress,
}: {
  progress: { total: number; answered: number; percentage: number };
}) {
  const variant: StatusBadgeProps["variant"] =
    progress.percentage === 100
      ? "success"
      : progress.percentage > 50
        ? "warning"
        : progress.percentage > 0
          ? "info"
          : "default";

  return (
    <StatusBadge variant={variant}>
      {progress.answered}/{progress.total} ({progress.percentage}%)
    </StatusBadge>
  );
}
