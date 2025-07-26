"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

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

  const navigationItems = [
    { label: "Start", icon: Home, href: "/" },
    { label: "VOTO Portal", icon: Globe, href: "https://portal.voto.vote/" },
  ];

  const aboutItems = [
    {
      label: "Häufige Fragen",
      icon: HelpCircle,
      href: "https://www.voto.vote/faq",
    },
    { label: "Was ist VOTO?", icon: Info, href: "https://www.voto.vote/" },
  ];

  const legalItems = [
    {
      label: "Datenschutz",
      icon: Shield,
      href: "https://www.voto.vote/datenschutz",
    },
    {
      label: "Impressum",
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
          <SheetTitle>VOTO</SheetTitle>
          <SheetDescription>Wählen einfach machen</SheetDescription>
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
              Information
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
              Rechtliches
            </h3>
            {legalItems.map((item) => (
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

          {/* Language Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-3 flex items-center">
              <Languages className="mr-2 size-4" />
              Sprachen
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
            © {new Date().getFullYear()} VOTO. All rights reserved.
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
