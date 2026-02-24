"use client";

import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        router.refresh();
        router.push("/guidance");
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [mounted, supabase, router]);

  if (!mounted) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          toast.error("Please enter your full name.");
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success("Account created successfully!");

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Logged in successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const getURL = () => {
        let url =
          process?.env?.NEXT_PUBLIC_SITE_URL ??
          process?.env?.NEXT_PUBLIC_VERCEL_URL ??
          'http://localhost:3000';
        url = url.includes('http') ? url : `https://${url}`;
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
        return `${url}auth/callback`;
      };

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getURL(),
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google.");
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <Header />
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center items-center py-16 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">{isSignUp ? "Create an account" : "Welcome back"}</CardTitle>
            <CardDescription>
              {isSignUp
                ? "Enter your details below to create your account"
                : "Enter your email below to login to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="grid gap-4">
              {isSignUp && (
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="John Doe"
                    required={isSignUp}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? "Sign Up" : "Login"}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                disabled={isLoading}
                onClick={signInWithGoogle}
              >
                Sign In with Google
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
