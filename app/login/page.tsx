"use client";

import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site/Header";

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Just as a fallback if the middleware doesn't catch them fast enough
        router.refresh();
        router.replace("/guidance");
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [mounted, supabase, router]);

  if (!mounted) return null;

  // Generate the callback URL based on the current origin
  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000';

    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return `${url}auth/callback`;
  };

  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-md px-4 py-10">
        <p className="text-sm text-muted-foreground mb-3">
          Sign in or create an account to save your progress.
        </p>
        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          redirectTo={getURL()}
          onlyThirdPartyProviders={false}
        />
      </div>
    </main>
  );
}
