"use client";

import Link from "next/link";
import { useCasino } from "@/context/CasinoContext";

export default function Header() {
  const { user, logout, addBalance } = useCasino();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a241c]/80 bg-[#0c0a08]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-[#e8c547] text-glow">
            ♛ Casino Rocas
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-[#e8c547]/40 bg-[#16120e] px-3 py-1.5">
            <span className="text-sm">💰</span>
            <span className="font-semibold text-[#e8c547] text-sm">
              ${user.balance.toLocaleString("es-AR")}
            </span>
          </div>

          <button
            onClick={() => addBalance(5000)}
            className="rounded-lg bg-[#e8c547]/15 border border-[#e8c547]/30 px-2.5 py-1 text-xs font-medium text-[#e8c547] transition hover:bg-[#e8c547]/25"
          >
            +$5k
          </button>

          <button
            onClick={logout}
            className="rounded-lg p-1.5 text-zinc-500 transition hover:text-red-400"
            title="Salir"
          >
            ⏻
          </button>
        </div>
      </div>
    </header>
  );
}
