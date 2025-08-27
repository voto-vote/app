"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { translateLocale } from "@/i18n/utils";
import {
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  Home,
  Info,
  Languages,
  Shield,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useDataSharingStore } from "@/stores/data-sharing-store";
import { Label } from "@/components/ui/label";

// Create a GitHub icon component that accepts className props like Lucide icons
const SimpleGitHubIcon = ({ className = "" }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

interface NavigationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NavigationSheet({
  open,
  onOpenChange,
}: NavigationSheetProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("NavigationSheet");

  const { dataSharingEnabled, disableDataSharing, enableDataSharing } =
    useDataSharingStore();

  const navigationItems = [
    { label: t("home"), icon: Home, href: "/" },
    { label: t("votoPortal"), icon: Globe, href: "https://portal.voto.vote/" },
    { label: "GitHub", icon: SimpleGitHubIcon, href: "https://github.com/voto-vote/app" }
  ];

  const aboutItems = [
    {
      label: t("frequentQuestions"),
      icon: HelpCircle,
      href: "https://www.voto.vote/faq",
    },
    { label: t("whatIsVoto"), icon: Info, href: "https://www.voto.vote/" },
  ];

  const legalItems = [
    {
      label: t("dataPrivacy"),
      icon: Shield,
      href: "https://www.voto.vote/datenschutz",
    },
    {
      label: t("imprint"),
      icon: FileText,
      href: "https://www.voto.vote/impressum",
    },
  ];

  function changeLanguage(newLocale: string) {
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: newLocale }
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("subtitle")}</SheetDescription>
        </SheetHeader>

        <div className="p-4 space-y-6 overflow-y-scroll">
          {/* Main Navigation */}
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start h-12 text-base font-medium hover:bg-primary/10"
                onClick={() => onOpenChange(false)}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 size-5" />
                  {item.label}
                  <ChevronRight className="ml-auto size-4 opacity-50" />
                </Link>
              </Button>
            ))}
          </div>

          <Separator />

          {/* About Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-3">
              {t("informations")}
            </h3>
            {aboutItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start h-11 text-sm hover:bg-primary/10"
                onClick={() => onOpenChange(false)}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 size-4" />
                  {item.label}
                  <ChevronRight className="ml-auto size-4 opacity-50" />
                </Link>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Legal Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-3">
              {t("legal")}
            </h3>
            {legalItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start h-11 text-sm hover:bg-primary/10"
                onClick={() => onOpenChange(false)}
                asChild
              >
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <item.icon className="mr-3 size-4" />
                  {item.label}
                  <ChevronRight className="ml-auto size-4 opacity-50" />
                </Link>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Settings for sharing anonymous data */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-3">
              {t("settings")}
            </h3>
            <div className="w-full justify-start h-11 text-sm px-3 flex items-center space-x-2">
              <Switch
                id="share-anonymous-data"
                checked={dataSharingEnabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    enableDataSharing();
                  } else {
                    disableDataSharing();
                  }
                }}
              />
              <Label htmlFor="share-anonymous-data">
                {t("sendAnonymousData")}
              </Label>
            </div>
          </div>

          <Separator />

          {/* Language Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-3 flex items-center">
              <Languages className="mr-2 size-4" />
              {t("languages")}
            </h3>
            {routing.locales
              //.filter((l) => election.locales.includes(l))
              .map((l) => (
                <Button
                  key={l}
                  variant={l === locale ? "secondary" : "ghost"}
                  className="w-full justify-start h-11 text-sm"
                  onClick={() => {
                    onOpenChange(false);
                    changeLanguage(l);
                  }}
                >
                  <Globe className="mr-3 size-4" />
                  {translateLocale(l, l)}
                  {l === locale && (
                    <div className="ml-auto size-2 rounded-full bg-primary" />
                  )}
                </Button>
              ))}
          </div>
        </div>

        {/* Footer */}
        <SheetFooter>
          <div className="text-xs text-muted-foreground text-center">
            {t("footer", { year: new Date().getFullYear() })}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}