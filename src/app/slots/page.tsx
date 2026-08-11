"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useCasino } from "@/context/CasinoContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MACHINES = [
  {
    id: "classic",
    name: "Clásica",
    emoji: "🍒",
    desc: "Frutas y 7s",
    gradient: "from-red-600 via-rose-700 to-red-950",
    href: "/slots/classic",
  },
  {
    id: "egypt",
    name: "Egipto",
    emoji: "🔺",
    desc: "Faraones y oro",
    gradient: "from-amber-500 via-yellow-700 to-orange-950",
    href: "/slots/egypt",
  },
  {
    id: "space",
    name: "Espacial",
    emoji: "🚀",
    desc: "Planetas y estrellas",
    gradient: "from-indigo-600 via-purple-700 to-violet-950",
    href: "/slots/space",
  },
  {
    id: "ocean",
    name: "Océano",
    emoji: "🐠",
    desc: "Peces y tesoros",
    gradient: "from-cyan-500 via-blue-700 to-blue-950",
    href: "/slots/ocean",
  },
  {
    id: "fortune",
    name: "Fortuna",
    emoji: "💎",
    desc: "Diamantes y campanas",
    gradient: "from-emerald-500 via-teal-700 to-green-950",
    href: "/slots/fortune",
  },
  {
    id: "fire",
    name: "Fuego",
    emoji: "🔥",
    desc: "Volcanes y lava",
    gradient: "from-orange-500 via-red-700 to-red-950",
    href: "/slots/fire",
  },
];

export default function SlotsLobby() {
  const { user, isLoading } = useCasino();
  const router = useRouter();

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

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-5">
        <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#e8c547]">
          ← Volver
        </Link>

        <h1 className="mb-1 text-center text-2xl font-bold text-[#e8c547]">🎰 Tragamonedas</h1>
        <p className="mb-5 text-center text-sm text-zinc-500">Elegí una máquina</p>

        <div className="grid grid-cols-2 gap-3">
          {MACHINES.map((m) => (
            <Link
              key={m.id}
              href={m.href}
              className="game-card relative overflow-hidden rounded-xl border border-white/5"
            >
              <div className={`aspect-[4/5] bg-gradient-to-br ${m.gradient} flex flex-col items-center justify-center p-3`}>
                <span className="text-4xl drop-shadow-xl">{m.emoji}</span>
                <span className="mt-2 text-sm font-bold text-white">{m.name}</span>
                <span className="mt-0.5 text-[10px] text-white/70">{m.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
