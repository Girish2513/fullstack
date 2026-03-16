"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useAuth } from "@/contexts/auth-context";

export default function Navigation() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useKeyboardShortcut(
    "3",
    useCallback(() => router.push("/tasks/new"), [router]),
    true,
  );
  useKeyboardShortcut(
    "k",
    useCallback(() => router.push("/tasks"), [router]),
    true,
  );

  return (
    <header className="border-b bg-background">
      <nav className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 p-4">
        <Link href="/" className="text-xl font-bold">
          Task Notes
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Home
          </Link>
          <Link href="/tasks" className={buttonVariants({ variant: "ghost" })}>
            Tasks
          </Link>
          <Link href="/about" className={buttonVariants({ variant: "ghost" })}>
            About
          </Link>
          {!loading && (
            <>
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground px-2">
                    {user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  Sign In
                </Link>
              )}
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
