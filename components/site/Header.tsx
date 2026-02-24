"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="w-full border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Student Saarthi
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/quiz">
            <Button variant={pathname === "/quiz" ? "default" : "ghost"}>Quiz</Button>
          </Link>
          <Link href="/guidance">
            <Button variant={pathname === "/guidance" ? "default" : "ghost"}>Guidance</Button>
          </Link>
          <Link href="/timeline">
            <Button variant={pathname === "/timeline" ? "default" : "ghost"}>Timeline</Button>
          </Link>
          <Link href="/colleges">
            <Button variant={pathname === "/colleges" ? "default" : "ghost"}>Colleges</Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Hello {user.user_metadata?.full_name || 'User'}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant={pathname === "/login" ? "default" : "ghost"}>Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}


