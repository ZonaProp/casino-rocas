"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCasino } from "@/context/CasinoContext";
import Link from "next/link";

const RED = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
type BetType = "number" | "red" | "black" | "even" | "odd" | "low" | "high";

export default function RuletaPage() {
  const { user, placeBet, isLoading } = useCasino();
  const router = useRouter();
  const [betAmount, setBetAmount] = useState(100);
  const [selected, setSelected] = useState<{ type: BetType; value?: number } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f5c542] border-t-transparent" /></div>;
  }

  const spin = () => {
    if (spinning || !selected || user.balance < betAmount) return;
    setSpinning(true);
    setResult(null);
    setMessage("");

    setTimeout(() => {
      const winning = Math.floor(Math.random() * 37);
      setResult(winning);
      let won = false;
      let mult = 0;

      if (selected.type === "number" && selected.value === winning) { won = true; mult = 36; }
      else if (selected.type === "red" && RED.includes(winning) && winning !== 0) { won = true; mult = 2; }
      else if (selected.type === "black" && !RED.includes(winning) && winning !== 0) { won = true; mult = 2; }
      else if (selected.type === "even" && winning !== 0 && winning % 2 === 0) { won = true; mult = 2; }
      else if (selected.type === "odd" && winning % 2 === 1) { won = true; mult = 2; }
      else if (selected.type === "low" && winning >= 1 && winning <= 18) { won = true; mult = 2; }
      else if (selected.type === "high" && winning >= 19 && winning <= 36) { won = true; mult = 2; }

      const payout = won ? betAmount * mult : 0;
      const net = payout - betAmount;
      const color = winning === 0 ? "Verde" : RED.includes(winning) ? "Rojo" : "Negro";
      placeBet("ruleta", betAmount, net, `Salió ${winning} (${color})`);
      setMessage(won ? `¡Ganaste $${payout.toLocaleString("es-AR")}!` : `Perdiste. Salió ${winning} (${color})`);
      setSpinning(false);
    }, 1800);
  };

  const isRed = (n: number) => RED.includes(n);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/" className="mb-6 inline-flex text-sm text-zinc-400 hover:text-[#f5c542]">← Volver al lobby</Link>
        <h1 className="mb-6 text-center text-3xl font-bold text-[#f5c542]">🎡 Ruleta Europea</h1>

        <div className="mb-8 flex flex-col items-center">
          <div className={`flex h-28 w-28 items-center justify-center rounded-full border-4 text-4xl font-bold ${
            result === null ? "border-[#2a2a3a] bg-[#14141f] text-zinc-500" :
            result === 0 ? "border-emerald-500 bg-emerald-900/40 text-emerald-300" :
            isRed(result) ? "border-red-500 bg-red-900/40 text-red-300" : "border-zinc-300 bg-zinc-800 text-white"
          } ${spinning ? "animate-pulse" : ""}`}>
            {spinning ? "..." : result ?? "?"}
          </div>
          {message && <p className={`mt-4 text-center font-medium ${message.includes("Ganaste") ? "text-emerald-400" : "text-red-400"}`}>{message}</p>}
        </div>

        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {[50,100,250,500,1000].map(b => (
            <button key={b} onClick={() => setBetAmount(b)} disabled={spinning} className={`rounded-lg px-3 py-1.5 text-sm ${betAmount === b ? "bg-[#f5c542] text-black" : "bg-[#1a1a28] text-zinc-300"}`}>${b}</button>
          ))}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[{"type":"red" as BetType,"label":"Rojo","color":"bg-red-700"},{"type":"black" as BetType,"label":"Negro","color":"bg-zinc-800"},{"type":"even" as BetType,"label":"Par","color":"bg-[#1a1a28]"},{"type":"odd" as BetType,"label":"Impar","color":"bg-[#1a1a28]"},{"type":"low" as BetType,"label":"1-18","color":"bg-[#1a1a28]"},{"type":"high" as BetType,"label":"19-36","color":"bg-[#1a1a28]"}].map(b => (
            <button key={b.type} onClick={() => setSelected({type: b.type})} disabled={spinning} className={`rounded-lg py-3 font-medium ${b.color} ${selected?.type === b.type ? "ring-2 ring-[#f5c542]" : ""}`}>{b.label}</button>
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-center text-xs text-zinc-500">O elegí un número (x36)</p>
          <div className="grid grid-cols-6 gap-1 sm:grid-cols-9">
            {Array.from({length:37},(_,i)=>i).map(n => (
              <button key={n} onClick={() => setSelected({type:"number",value:n})} disabled={spinning} className={`aspect-square rounded text-sm font-medium ${
                n===0 ? "bg-emerald-800" : isRed(n) ? "bg-red-700" : "bg-zinc-800"
              } ${selected?.type==="number" && selected.value===n ? "ring-2 ring-[#f5c542]" : ""}`}>{n}</button>
            ))}
          </div>
        </div>

        <button onClick={spin} disabled={spinning || !selected || user.balance < betAmount} className="w-full rounded-xl bg-gradient-to-r from-[#f5c542] to-[#c9a227] py-4 text-lg font-bold text-black disabled:opacity-40">
          {spinning ? "Girando..." : "GIRAR"}
        </button>
      </main>
    </div>
  );
}
