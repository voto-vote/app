"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminAuthStore } from "@/stores/admin";
import { mockAcceptTerms } from "@/actions/admin";

export default function TermsAcceptancePage() {
  const router = useRouter();
  const locale = useLocale();
  const { user, setUser } = useAdminAuthStore();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!user || !accepted) return;

    setLoading(true);
    try {
      const success = await mockAcceptTerms(user.id, "1.0");
      if (success) {
        setUser({
          ...user,
          agreedToTerms: true,
          agreedToTermsDate: new Date().toISOString(),
        });
        router.push(`/${locale}/admin`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Terms of Service</CardTitle>
          <CardDescription>
            Please review and accept our terms before continuing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Terms Content */}
          <div className="max-h-96 overflow-y-auto rounded-md border bg-muted/50 p-4">
            <h3 className="mb-2 font-semibold">
              Allgemeine Geschäftsbedingungen (AGB) - VOTO
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>1. Geltungsbereich</strong>
                <br />
                Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung
                der VOTO-Plattform zur Erstellung und Verwaltung von Wahlhilfen
                und Abstimmungsprozessen.
              </p>
              <p>
                <strong>2. Nutzungsbedingungen</strong>
                <br />
                Die Nutzung der Plattform ist nur für registrierte Nutzer mit
                gültigen Anmeldedaten gestattet. Sie verpflichten sich, Ihre
                Zugangsdaten vertraulich zu behandeln und nicht an Dritte
                weiterzugeben.
              </p>
              <p>
                <strong>3. Datenschutz</strong>
                <br />
                Wir verarbeiten personenbezogene Daten gemäß unserer
                Datenschutzerklärung und den geltenden Datenschutzgesetzen
                (DSGVO). Die Daten der Nutzer werden ausschließlich für die
                Bereitstellung des Dienstes verwendet.
              </p>
              <p>
                <strong>4. Verantwortlichkeiten</strong>
                <br />
                Als Wahlverwalter sind Sie für die Richtigkeit und
                Rechtmäßigkeit der von Ihnen eingegebenen Inhalte
                verantwortlich. Dies umfasst Thesen, Kandidateninformationen und
                Parteibeschreibungen.
              </p>
              <p>
                <strong>5. Haftungsausschluss</strong>
                <br />
                VOTO haftet nicht für Schäden, die durch die fehlerhafte Nutzung
                der Plattform oder durch von Nutzern eingegebene Inhalte
                entstehen.
              </p>
              <p>
                <strong>6. Änderungen</strong>
                <br />
                Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern.
                Über wesentliche Änderungen werden Sie per E-Mail informiert.
              </p>
              <p>
                <strong>7. Schlussbestimmungen</strong>
                <br />
                Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand
                ist Stuttgart.
              </p>
            </div>
          </div>

          {/* Accept Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="accept"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <label
              htmlFor="accept"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and accept the Terms of Service
            </label>
          </div>

          {/* Accept Button */}
          <Button
            className="w-full"
            onClick={handleAccept}
            disabled={!accepted || loading}
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Accept and Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
