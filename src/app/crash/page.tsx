"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCasino } from "@/context/CasinoContext";
import Link from "next/link";

function generateCrashPoint(): number {
  // ~3% house edge, classic crash formula
  const e = Math.random();
  if (e < 0.03) return 1.0; // small chance of instant crash
  const point = Math.floor((0.97 / (1 - e)) * 100) / 100;
  return Math.min(point, 500); // hard cap
}

export default function CrashPage() {
  const { user, placeBet, isLoading } = useCasino();
  const router = useRouter();

  const [bet, setBet] = useState(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [isFlying, setIsFlying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState(1.0);
  const [message, setMessage] = useState("");
  const [recentCrashes, setRecentCrashes] = useState<number[]>([2.14, 1.32, 5.67, 1.01, 3.45, 12.8, 1.87, 2.91]);

  const crashPointRef = useRef(1.0);
  const cashedOutRef = useRef(false);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!isLoading && !user) router.push("/");
  }, [user, isLoading, router]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f5c542] border-t-transparent" />
      </div>
    );
  }

  const startFlight = () => {
    if (isFlying || user.balance < bet) return;

    const point = generateCrashPoint();
    crashPointRef.current = point;
    setCrashPoint(point);
    setMultiplier(1.0);
    setIsFlying(true);
    setCrashed(false);
    setCashedOut(false);
    cashedOutRef.current = false;
    setMessage("");
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000; // seconds
      // Smooth rising curve (approx exponential feel)
      const current = Math.pow(Math.E, 0.06 * elapsed);
      const display = Math.floor(current * 100) / 100;

      if (display >= crashPointRef.current) {
        // Crash!
        setMultiplier(crashPointRef.current);
        setIsFlying(false);
        setCrashed(true);
        setRecentCrashes((prev) => [crashPointRef.current, ...prev].slice(0, 12));

        if (!cashedOutRef.current) {
          placeBet("crash", bet, -bet, `Crash @ ${crashPointRef.current.toFixed(2)}x`);
          setMessage(`💥 Se estrelló en ${crashPointRef.current.toFixed(2)}x`);
        }
        return;
      }

      setMultiplier(display);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
  };

  const cashOut = () => {
    if (!isFlying || cashedOutRef.current) return;

    cashedOutRef.current = true;
    setCashedOut(true);
    setIsFlying(false);

    if (animRef.current) cancelAnimationFrame(animRef.current);

    const win = Math.floor(bet * multiplier);
    const net = win - bet;
    placeBet("crash", bet, net, `Cash out @ ${multiplier.toFixed(2)}x`);
    setMessage(`✅ Cobraste ${multiplier.toFixed(2)}x → +$${net.toLocaleString("es-AR")}`);
  };

  const getMultiColor = () => {
    if (crashed && !cashedOut) return "text-red-500";
    if (cashedOut) return "text-emerald-400";
    if (multiplier >= 10) return "text-purple-400";
    if (multiplier >= 5) return "text-yellow-300";
    if (multiplier >= 2) return "text-emerald-300";
    return "text-[#f5c542]";
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-6">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#f5c542]">
          ← Volver al lobby
        </Link>

        <h1 className="mb-2 text-center text-2xl font-bold text-[#f5c542]">🚀 Crash</h1>
        <p className="mb-6 text-center text-sm text-zinc-500">Cobrá antes de que se estrelle</p>

        {/* Recent crashes */}
        <div className="mb-5 flex flex-wrap justify-center gap-1.5">
          {recentCrashes.map((c, i) => (
            <span
              key={i}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                c < 2 ? "bg-red-900/60 text-red-300" : c < 5 ? "bg-emerald-900/50 text-emerald-300" : "bg-purple-900/50 text-purple-300"
              }`}
            >
              {c.toFixed(2)}x
            </span>
          ))}
        </div>

        {/* Multiplier display */}
        <div className="mb-8 flex flex-col items-center justify-center rounded-2xl border border-[#2a2a3a] bg-[#0f0f18] py-12 glow-gold">
          <div className={`text-6xl font-black tabular-nums transition-colors ${getMultiColor()}`}>
            {multiplier.toFixed(2)}x
          </div>
          {isFlying && !cashedOut && (
            <div className="mt-3 text-sm text-zinc-400 animate-pulse">Volando...</div>
          )}
          {crashed && !cashedOut && (
            <div className="mt-3 text-lg font-bold text-red-400">💥 CRASH</div>
          )}
          {cashedOut && (
            <div className="mt-3 text-lg font-bold text-emerald-400">✅ Cobraste</div>
          )}
        </div>

        {message && (
          <p className={`mb-4 text-center text-base font-semibold ${
            message.includes("Cobraste") ? "text-emerald-400" : "text-red-400"
          }`}>
            {message}
          </p>
        )}

        {/* Bet controls */}
        {!isFlying ? (
          <>
            <div className="mb-4">
              <p className="mb-2 text-center text-sm text-zinc-400">Apuesta</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[50, 100, 250, 500, 1000, 2500].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBet(b)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      bet === b ? "bg-[#f5c542] text-black" : "bg-[#1a1a28] text-zinc-300 hover:bg-[#2a2a3a]"
                    }`}
                  >
                    ${b.toLocaleString("es-AR")}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startFlight}
              disabled={user.balance < bet}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-600 py-4 text-lg font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-40"
            >
              Apostar ${bet.toLocaleString("es-AR")}
            </button>
          </>
        ) : (
          <button
            onClick={cashOut}
            disabled={cashedOut}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-4 text-lg font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-40"
          >
            {cashedOut ? "Ya cobraste" : `Cobrar ${multiplier.toFixed(2)}x`}
          </button>
        )}

        <p className="mt-6 text-center text-xs text-zinc-600">
          Solo entretenimiento · House edge ~3%
        </p>
      </main>
    </div>
  );
}
