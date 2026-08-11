"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCasino } from "@/context/CasinoContext";
import Link from "next/link";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐", "7️⃣", "💎"];
const PAYTABLE: Record<string, number> = {
  "💎💎💎": 50,
  "7️⃣7️⃣7️⃣": 30,
  "⭐⭐⭐": 20,
  "🔔🔔🔔": 15,
  "🍇🍇🍇": 10,
  "🍊🍊🍊": 8,
  "🍋🍋🍋": 6,
  "🍒🍒🍒": 5,
};

function getRandomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export default function SlotsPage() {
  const { user, placeBet, isLoading } = useCasino();
  const router = useRouter();
  const [bet, setBet] = useState(100);
  const [reels, setReels] = useState(["❓", "❓", "❓"]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f5c542] border-t-transparent" />
      </div>
    );
  }

  const spin = () => {
    if (spinning || user.balance < bet) return;
    setSpinning(true);
    setMessage("");

    let ticks = 0;
    const interval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
      ticks++;
      if (ticks > 12) {
        clearInterval(interval);
        const final = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        setReels(final);
        const key = final.join("");
        const multiplier = PAYTABLE[key] || 0;
        const payout = bet * multiplier;
        const net = payout - bet;
        placeBet("slots", bet, net, `${final.join(" ")} → x${multiplier}`);
        setMessage(multiplier > 0 ? `¡Ganaste $${payout.toLocaleString("es-AR")}!` : "Sin premio esta vez");
        setSpinning(false);
      }
    }, 80);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#f5c542]">
          ← Volver al lobby
        </Link>
        <h1 className="mb-6 text-center text-3xl font-bold text-[#f5c542]">🎰 Tragamonedas</h1>

        <div className="mb-8 rounded-2xl border-2 border-[#f5c542]/50 bg-[#14141f] p-6 glow-gold">
          <div className="flex justify-center gap-3 text-6xl">
            {reels.map((s, i) => (
              <div key={i} className={`flex h-24 w-20 items-center justify-center rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] ${spinning ? "animate-pulse" : ""}`}>
                {s}
              </div>
            ))}
          </div>
        </div>

        {message && (
          <p className={`mb-4 text-center text-lg font-semibold ${message.includes("Ganaste") ? "text-emerald-400" : "text-zinc-400"}`}>
            {message}
          </p>
        )}

        <div className="mb-6">
          <p className="mb-2 text-center text-sm text-zinc-400">Apuesta</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[50, 100, 250, 500, 1000].map((b) => (
              <button key={b} onClick={() => setBet(b)} disabled={spinning} className={`rounded-lg px-4 py-2 text-sm font-medium ${bet === b ? "bg-[#f5c542] text-black" : "bg-[#1a1a28] text-zinc-300"}`}>
                ${b}
              </button>
            ))}
          </div>
        </div>

        <button onClick={spin} disabled={spinning || user.balance < bet} className="w-full rounded-xl bg-gradient-to-r from-[#f5c542] to-[#c9a227] py-4 text-lg font-bold text-black disabled:opacity-40">
          {spinning ? "Girando..." : `GIRAR · $${bet.toLocaleString("es-AR")}`}
        </button>

        <div className="mt-8 rounded-xl border border-[#2a2a3a] bg-[#14141f] p-4 text-sm">
          <p className="mb-2 font-medium text-zinc-300">Tabla de pagos</p>
          <div className="grid grid-cols-2 gap-1 text-zinc-400">
            <span>💎💎💎 → x50</span><span>7️⃣7️⃣7️⃣ → x30</span>
            <span>⭐⭐⭐ → x20</span><span>🔔🔔🔔 → x15</span>
            <span>🍇🍇🍇 → x10</span><span>🍒🍒🍒 → x5</span>
          </div>
        </div>
      </main>
    </div>
  );
}
