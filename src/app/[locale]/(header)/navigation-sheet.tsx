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
import { GitHub } from "@/lib/icons";

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
    { label: "GitHub", icon: GitHub, href: "https://github.com/voto-vote/app" },
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