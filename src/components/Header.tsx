"use client";

import Link from "next/link";
import { useCasino } from "@/context/CasinoContext";
// Using emoji icons to keep dependencies minimal

export default function Header() {
  const { user, logout, addBalance } = useCasino();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a3a] bg-[#0a0a0f]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-[#f5c542] text-glow">
            Casino Rocas
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-[#f5c542]/40 bg-[#14141f] px-4 py-1.5 glow-gold">
            <span className="text-lg">🪙</span>
            <span className="font-semibold text-[#f5c542]">
              ${user.balance.toLocaleString("es-AR")}
            </span>
          </div>

          <button
            onClick={() => addBalance(5000)}
            className="hidden sm:inline-flex rounded-lg bg-[#2a9d8f] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#21867a]"
          >
            + $5.000
          </button>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>👤</span>
            <span className="hidden sm:inline">{user.username}</span>
          </div>

          <button
            onClick={logout}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-red-400"
            title="Cerrar sesión"
          >
            🚪
          </button>
        </div>
      </div>
    </header>
  );
}
