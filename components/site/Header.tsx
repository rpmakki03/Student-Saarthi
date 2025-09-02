"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
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
          <Link href="/login">
            <Button variant={pathname === "/login" ? "default" : "ghost"}>Login</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}


