"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCasino } from "@/context/CasinoContext";
import Link from "next/link";

const MULTIPLIERS = [0.2, 0.5, 1, 1.5, 3, 5, 3, 1.5, 1, 0.5, 0.2];

export default function PlinkoPage() {
  const { user, placeBet, isLoading } = useCasino();
  const router = useRouter();
  const [bet, setBet] = useState(100);
  const [dropping, setDropping] = useState(false);
  const [result, setResult] = useState<{ multi: number; slot: number } | null>(null);
  const [ballPos, setBallPos] = useState({ x: 50, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

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

  const drop = () => {
    if (dropping || user.balance < bet) return;
    setDropping(true);
    setResult(null);

    // Simulate path with slight randomness
    let pathX = 50;
    const steps = 12;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      // Random left/right bias
      const direction = Math.random() > 0.5 ? 1 : -1;
      pathX += direction * (3 + Math.random() * 4);
      pathX = Math.max(8, Math.min(92, pathX));
      setBallPos({ x: pathX, y: (step / steps) * 85 });

      if (step >= steps) {
        clearInterval(interval);
        // Determine slot based on final X
        const slot = Math.min(10, Math.max(0, Math.floor((pathX / 100) * 11)));
        const multi = MULTIPLIERS[slot];
        const win = Math.floor(bet * multi);
        const net = win - bet;

        placeBet("plinko", bet, net, `Plinko · x${multi}`);
        setResult({ multi, slot });
        setDropping(false);
        setTimeout(() => setBallPos({ x: 50, y: 0 }), 1500);
      }
    }, 90);
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="mx-auto max-w-md px-4 py-5">
        <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#e8c547]">
          ← Volver
        </Link>

        <h1 className="mb-1 text-center text-2xl font-bold text-[#e8c547]">🎱 Plinko</h1>
        <p className="mb-5 text-center text-sm text-zinc-500">Tirás la pelota y cae en un multiplicador</p>

        {/* Board */}
        <div
          ref={canvasRef}
          className="relative mx-auto mb-4 h-72 w-full max-w-sm overflow-hidden rounded-2xl border border-[#2a241c] bg-[#0a0806]"
        >
          {/* Pegs */}
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: row + 3 }).map((_, col) => {
              const total = row + 3;
              const left = ((col + 0.5) / total) * 100;
              return (
                <div
                  key={`${row}-${col}`}
                  className="absolute h-2 w-2 rounded-full bg-[#e8c547]/70"
                  style={{
                    top: `${12 + row * 9}%`,
                    left: `${left}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              );
            })
          )}

          {/* Ball */}
          <div
            className="absolute h-4 w-4 rounded-full bg-white shadow-lg transition-all duration-100"
            style={{
              left: `${ballPos.x}%`,
              top: `${ballPos.y}%`,
              transform: "translate(-50%, -50%)",
              opacity: dropping || result ? 1 : 0.3,
            }}
          />

          {/* Multiplier slots at bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex">
            {MULTIPLIERS.map((m, i) => (
              <div
                key={i}
                className={`flex-1 border-t border-r border-[#2a241c] py-2 text-center text-[10px] font-bold last:border-r-0 ${
                  result?.slot === i
                    ? m >= 3
                      ? "bg-emerald-600 text-white"
                      : m >= 1
                      ? "bg-yellow-600 text-black"
                      : "bg-red-700 text-white"
                    : m >= 3
                    ? "bg-emerald-900/40 text-emerald-300"
                    : m >= 1
                    ? "bg-yellow-900/30 text-yellow-300"
                    : "bg-red-900/30 text-red-300"
                }`}
              >
                {m}x
              </div>
            ))}
          </div>
        </div>

        {result && (
          <p
            className={`mb-4 text-center text-lg font-bold ${
              result.multi >= 1 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {result.multi >= 1 ? "+" : ""}
            {Math.floor(bet * result.multi - bet).toLocaleString("es-AR")} · x{result.multi}
          </p>
        )}

        {/* Bet controls */}
        <div className="mb-4">
          <p className="mb-2 text-center text-sm text-zinc-400">Apuesta</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[50, 100, 250, 500, 1000].map((b) => (
              <button
                key={b}
                onClick={() => setBet(b)}
                disabled={dropping}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  bet === b ? "bg-[#e8c547] text-black" : "bg-[#1a150f] text-zinc-300"
                }`}
              >
                ${b}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={drop}
          disabled={dropping || user.balance < bet}
          className="w-full rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] py-4 text-lg font-bold text-black disabled:opacity-40"
        >
          {dropping ? "Cayendo..." : `Tirar · $${bet.toLocaleString("es-AR")}`}
        </button>
      </main>
    </div>
  );
}
