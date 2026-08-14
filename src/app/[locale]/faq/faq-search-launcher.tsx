import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

interface FAQSearchLauncherProps {
  configId?: string;
  description: string;
  disclaimer: string;
  notConfigured: string;
  openInNewTab: string;
  title: string;
}

export default function FAQSearchLauncher({
  configId,
  description,
  disclaimer,
  notConfigured,
  openInNewTab,
  title,
}: FAQSearchLauncherProps) {
  return (
    <section className="mb-8 overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6">
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            {description}
          </p>
        </div>

        <div className="shrink-0">
          {configId ? (
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link
                href="/faq/chat"
                target="_blank"
                rel="noopener noreferrer"
              >
                {openInNewTab}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <p className="rounded-md bg-muted px-4 py-3 text-sm leading-6 text-muted-foreground">
              {notConfigured}
            </p>
          )}
        </div>
      </div>

      <p className="border-t px-5 py-4 text-sm leading-6 text-muted-foreground md:px-6">
        {disclaimer}
      </p>
    </section>
  );
}
