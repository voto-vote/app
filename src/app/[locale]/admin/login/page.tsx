"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Vote, Mail } from "lucide-react";
import { SiGoogle, SiMicrosoft, SiApple } from "@icons-pack/react-simple-icons";
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
import { Separator } from "@/components/ui/separator";
import { useAdminAuthStore } from "@/stores/admin";
import { mockLoginWithProvider, mockSendMagicLink } from "@/actions/admin";
import type { AuthProvider } from "@/types/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const { setUser } = useAdminAuthStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<AuthProvider | "email" | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: AuthProvider) => {
    setLoading(provider);
    setError(null);

    try {
      const user = await mockLoginWithProvider(provider);
      if (user) {
        setUser(user);
        router.push(`/${locale}/admin`);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("email");
    setError(null);

    try {
      const result = await mockSendMagicLink(email);
      if (result.success) {
        setMagicLinkSent(true);
      } else {
        setError(result.message);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Vote className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Welcome to VOTO Admin</CardTitle>
          <CardDescription>Sign in to manage your elections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {magicLinkSent ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a magic link to <strong>{email}</strong>
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setMagicLinkSent(false)}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              {/* Social Login Buttons */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("google")}
                  disabled={loading !== null}
                >
                  {loading === "google" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <SiGoogle className="mr-2 h-4 w-4" />
                  )}
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("microsoft")}
                  disabled={loading !== null}
                >
                  {loading === "microsoft" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <SiMicrosoft className="mr-2 h-4 w-4" />
                  )}
                  Continue with Microsoft
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("apple")}
                  disabled={loading !== null}
                >
                  {loading === "apple" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <SiApple className="mr-2 h-4 w-4" />
                  )}
                  Continue with Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Magic Link Form */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading !== null}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading !== null || !email}
                >
                  {loading === "email" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Send Magic Link
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
