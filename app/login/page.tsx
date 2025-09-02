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
        router.replace("/guidance");
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [mounted, supabase, router]);
  if (!mounted) return null;

  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-md px-4 py-10">
        <p className="text-sm text-muted-foreground mb-3">
          Email sign-in is instant. No email confirmation required.
        </p>
        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          onlyThirdPartyProviders={false}
        />
      </div>
    </main>
  );
}


