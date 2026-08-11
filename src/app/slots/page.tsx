"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useCasino } from "@/context/CasinoContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MACHINES = [
  { id: "classic", name: "Clásica", emoji: "🍒", gradient: "from-red-600 to-red-950" },
  { id: "egypt", name: "Egipto", emoji: "🔺", gradient: "from-amber-500 to-orange-950" },
  { id: "space", name: "Espacial", emoji: "🚀", gradient: "from-indigo-600 to-violet-950" },
  { id: "ocean", name: "Océano", emoji: "🐠", gradient: "from-cyan-500 to-blue-950" },
  { id: "fortune", name: "Fortuna", emoji: "💎", gradient: "from-emerald-500 to-green-950" },
  { id: "fire", name: "Fuego", emoji: "🔥", gradient: "from-orange-500 to-red-950" },
  { id: "jungle", name: "Jungla", emoji: "🦁", gradient: "from-lime-600 to-emerald-950" },
  { id: "pirate", name: "Pirata", emoji: "🏴‍☠️", gradient: "from-yellow-600 to-orange-950" },
  { id: "candy", name: "Dulce", emoji: "🍬", gradient: "from-pink-500 to-purple-900" },
  { id: "vegas", name: "Vegas", emoji: "🎲", gradient: "from-red-500 to-pink-900" },
  { id: "norse", name: "Nórdico", emoji: "⚡", gradient: "from-sky-500 to-slate-900" },
  { id: "japan", name: "Japón", emoji: "🎎", gradient: "from-rose-400 to-red-900" },
  { id: "maya", name: "Maya", emoji: "🗿", gradient: "from-stone-500 to-yellow-950" },
  { id: "cyber", name: "Cyber", emoji: "🤖", gradient: "from-cyan-400 to-indigo-950" },
  { id: "horror", name: "Horror", emoji: "👻", gradient: "from-purple-800 to-black" },
  { id: "western", name: "Western", emoji: "🤠", gradient: "from-amber-600 to-yellow-950" },
  { id: "magic", name: "Magia", emoji: "🪄", gradient: "from-violet-500 to-fuchsia-950" },
  { id: "sport", name: "Deporte", emoji: "⚽", gradient: "from-green-500 to-teal-950" },
  { id: "gold", name: "Oro", emoji: "👑", gradient: "from-yellow-400 to-yellow-900" },
  { id: "ice", name: "Hielo", emoji: "❄️", gradient: "from-sky-300 to-blue-950" },
  { id: "dragon", name: "Dragón", emoji: "🐉", gradient: "from-red-600 to-yellow-900" },
  { id: "fruit", name: "Frutal", emoji: "🍉", gradient: "from-green-400 to-emerald-900" },
  { id: "neon", name: "Neón", emoji: "💜", gradient: "from-fuchsia-500 to-purple-950" },
  { id: "lucky", name: "Suerte", emoji: "🍀", gradient: "from-green-500 to-green-950" },
  { id: "diamond", name: "Diamante", emoji: "💍", gradient: "from-blue-400 to-violet-950" },
  { id: "party", name: "Fiesta", emoji: "🎉", gradient: "from-pink-500 to-orange-800" },
  { id: "mystic", name: "Místico", emoji: "🔮", gradient: "from-indigo-500 to-slate-950" },
  { id: "safari", name: "Safari", emoji: "🦒", gradient: "from-yellow-500 to-orange-950" },
  { id: "galaxy", name: "Galaxia", emoji: "🌌", gradient: "from-violet-600 to-black" },
  { id: "carnival", name: "Carnaval", emoji: "🎭", gradient: "from-yellow-400 to-red-700" },
];

export default function SpotsLobby() {
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
      <main className="mx-auto max-w-lg px-3 py-4">
        <Link href="/" className="mb-3 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#e8c547]">
          ← Volver
        </Link>

        <h1 className="mb-1 text-center text-xl font-bold text-[#e8c547]">🎰 Tragamonedas</h1>
        <p className="mb-4 text-center text-xs text-zinc-500">{MACHINES.length} máquinas</p>

        <div className="grid grid-cols-3 gap-2">
          {MACHINES.map((m) => (
            <Link
              key={m.id}
              href={`/slots/${m.id}`}
              className="game-card relative overflow-hidden rounded-xl border border-white/10"
            >
              <div className={`aspect-square bg-gradient-to-br ${m.gradient} flex flex-col items-center justify-center p-2`}>
                <span className="text-2xl">{m.emoji}</span>
                <span className="mt-1 text-[11px] font-bold text-white text-center leading-tight">{m.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
