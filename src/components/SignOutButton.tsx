"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="group flex items-center gap-2.5 px-6 py-3 bg-background/70 backdrop-blur-sm border border-foreground/15 text-foreground/70 rounded-2xl font-semibold text-sm hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 shadow-sm hover:shadow-lg active:scale-95"
    >
      <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      Sign Out
    </button>
  );
}
