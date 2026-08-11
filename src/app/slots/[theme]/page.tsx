"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import { useCasino } from "@/context/CasinoContext";
import Link from "next/link";

const THEMES: Record<
  string,
  {
    name: string;
    symbols: string[];
    paytable: Record<string, number>;
    color: string;
  }
> = {
  classic: {
    name: "Clásica",
    symbols: ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐", "7️⃣", "💎"],
    paytable: {
      "💎💎💎": 50,
      "7️⃣7️⃣7️⃣": 30,
      "⭐⭐⭐": 20,
      "🔔🔔🔔": 15,
      "🍇🍇🍇": 10,
      "🍊🍊🍊": 8,
      "🍋🍋🍋": 6,
      "🍒🍒🍒": 5,
    },
    color: "#e63946",
  },
  egypt: {
    name: "Egipto",
    symbols: ["🔺", "👁️", "🏺", "🐍", "📜", "🪙", "👑", "💎"],
    paytable: {
      "💎💎💎": 60,
      "👑👑👑": 40,
      "🪙🪙🪙": 25,
      "📜📜📜": 15,
      "🐍🐍🐍": 12,
      "🏺🏺🏺": 8,
      "👁️👁️👁️": 6,
      "🔺🔺🔺": 5,
    },
    color: "#e8c547",
  },
  space: {
    name: "Espacial",
    symbols: ["🚀", "🪐", "⭐", "🌑", "👽", "🛸", "💫", "💎"],
    paytable: {
      "💎💎💎": 55,
      "🛸🛸🛸": 35,
      "💫💫💫": 22,
      "👽👽👽": 15,
      "🪐🪐🪐": 10,
      "⭐⭐⭐": 8,
      "🌑🌑🌑": 6,
      "🚀🚀🚀": 5,
    },
    color: "#8b5cf6",
  },
  ocean: {
    name: "Océano",
    symbols: ["🐠", "🐡", "🐙", "🐚", "⚓", "🌊", "💎", "🏆"],
    paytable: {
      "🏆🏆🏆": 50,
      "💎💎💎": 35,
      "🌊🌊🌊": 20,
      "⚓⚓⚓": 15,
      "🐚🐚🐚": 10,
      "🐙🐙🐙": 8,
      "🐡🐡🐡": 6,
      "🐠🐠🐠": 5,
    },
    color: "#06b6d4",
  },
  fortune: {
    name: "Fortuna",
    symbols: ["💎", "🔔", "⭐", "🍀", "💰", "🪙", "👑", "7️⃣"],
    paytable: {
      "7️⃣7️⃣7️⃣": 60,
      "👑👑👑": 40,
      "💰💰💰": 25,
      "🪙🪙🪙": 15,
      "🍀🍀🍀": 12,
      "⭐⭐⭐": 8,
      "🔔🔔🔔": 6,
      "💎💎💎": 5,
    },
    color: "#10b981",
  },
  fire: {
    name: "Fuego",
    symbols: ["🔥", "🌋", "☄️", "⚡", "💥", "🔶", "⭐", "💎"],
    paytable: {
      "💎💎💎": 55,
      "💥💥💥": 35,
      "⚡⚡⚡": 22,
      "☄️☄️☄️": 15,
      "🌋🌋🌋": 10,
      "🔶🔶🔶": 8,
      "⭐⭐⭐": 6,
      "🔥🔥🔥": 5,
    },
    color: "#f97316",
  },
};

export default function ThemeSlotPage() {
  const { user, placeBet, isLoading } = useCasino();
  const router = useRouter();
  const params = useParams();
  const themeId = (params.theme as string) || "classic";
  const theme = THEMES[themeId] || THEMES.classic;

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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8c547] border-t-transparent" />
      </div>
    );
  }

  const getRandom = () => theme.symbols[Math.floor(Math.random() * theme.symbols.length)];

  const spin = () => {
    if (spinning || user.balance < bet) return;
    setSpinning(true);
    setMessage("");

    let ticks = 0;
    const interval = setInterval(() => {
      setReels([getRandom(), getRandom(), getRandom()]);
      ticks++;
      if (ticks > 14) {
        clearInterval(interval);
        const final = [getRandom(), getRandom(), getRandom()];
        setReels(final);
        const key = final.join("");
        const multi = theme.paytable[key] || 0;
        const payout = bet * multi;
        const net = payout - bet;
        placeBet("slots", bet, net, `${theme.name}: ${final.join(" ")} x${multi}`);
        setMessage(multi > 0 ? `¡Ganaste $${payout.toLocaleString("es-AR")}!` : "Sin premio");
        setSpinning(false);
      }
    }, 70);
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />
      <main className="mx-auto max-w-md px-4 py-5">
        <Link href="/slots" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#e8c547]">
          ← Todas las máquinas
        </Link>

        <h1 className="mb-5 text-center text-2xl font-bold" style={{ color: theme.color }}>
          {theme.name}
        </h1>

        <div className="mb-6 rounded-2xl border-2 p-5" style={{ borderColor: `${theme.color}55`, background: "#0a0806" }}>
          <div className="flex justify-center gap-2.5 text-5xl">
            {reels.map((s, i) => (
              <div
                key={i}
                className={`flex h-24 w-[72px] items-center justify-center rounded-xl border bg-[#12100c] ${spinning ? "animate-pulse" : ""}`}
                style={{ borderColor: `${theme.color}33` }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {message && (
          <p className={`mb-4 text-center text-base font-semibold ${message.includes("Ganaste") ? "text-emerald-400" : "text-zinc-500"}`}>
            {message}
          </p>
        )}

        <div className="mb-4">
          <p className="mb-2 text-center text-sm text-zinc-400">Apuesta</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[50, 100, 250, 500, 1000].map((b) => (
              <button
                key={b}
                onClick={() => setBet(b)}
                disabled={spinning}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  bet === b ? "text-black" : "bg-[#1a150f] text-zinc-300"
                }`}
                style={bet === b ? { background: theme.color } : {}}
              >
                ${b}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning || user.balance < bet}
          className="w-full rounded-xl py-4 text-lg font-bold text-black disabled:opacity-40"
          style={{ background: `linear-gradient(to right, ${theme.color}, ${theme.color}cc)` }}
        >
          {spinning ? "Girando..." : `GIRAR · $${bet.toLocaleString("es-AR")}`}
        </button>

        <div className="mt-6 rounded-xl border border-[#2a241c] bg-[#16120e] p-3 text-xs text-zinc-400">
          <p className="mb-1.5 font-medium text-zinc-300">Premios</p>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(theme.paytable)
              .slice(0, 6)
              .map(([k, v]) => (
                <span key={k}>
                  {k} → x{v}
                </span>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
