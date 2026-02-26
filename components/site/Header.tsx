"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <header className="w-full max-w-5xl rounded-full border bg-background/80 backdrop-blur-lg shadow-sm pill-shadow supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="px-6 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
            <span className="text-primary text-2xl"></span> Student Saarthi
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/quiz">
              <Button variant={pathname === "/quiz" ? "secondary" : "ghost"} className="rounded-full">Quiz</Button>
            </Link>
            <Link href="/guidance">
              <Button variant={pathname === "/guidance" ? "secondary" : "ghost"} className="rounded-full">Guidance</Button>
            </Link>
            <Link href="/timeline">
              <Button variant={pathname === "/timeline" ? "secondary" : "ghost"} className="rounded-full">Timeline</Button>
            </Link>
            <Link href="/colleges">
              <Button variant={pathname === "/colleges" ? "secondary" : "ghost"} className="rounded-full">Colleges</Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-sm font-medium px-3 py-1 bg-secondary rounded-full">
                  👋 {user.user_metadata?.full_name || 'User'}
                </span>
                <Button variant="outline" size="sm" className="rounded-full border-2" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default" className="rounded-full font-semibold px-6 shadow-md hover:shadow-lg transition-all duration-300">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}


