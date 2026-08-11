"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useCasino } from "@/context/CasinoContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MACHINES = [
  { id: "classic", name: "Clásica", emoji: "🍒", desc: "Frutas y 7s", gradient: "from-red-600 via-rose-700 to-red-950" },
  { id: "egypt", name: "Egipto", emoji: "🔺", desc: "Faraones", gradient: "from-amber-500 via-yellow-700 to-orange-950" },
  { id: "space", name: "Espacial", emoji: "🚀", desc: "Planetas", gradient: "from-indigo-600 via-purple-700 to-violet-950" },
  { id: "ocean", name: "Océano", emoji: "🐠", desc: "Peces", gradient: "from-cyan-500 via-blue-700 to-blue-950" },
  { id: "fortune", name: "Fortuna", emoji: "💎", desc: "Diamantes", gradient: "from-emerald-500 via-teal-700 to-green-950" },
  { id: "fire", name: "Fuego", emoji: "🔥", desc: "Volcanes", gradient: "from-orange-500 via-red-700 to-red-950" },
  { id: "jungle", name: "Jungla", emoji: "🦁", desc: "Animales", gradient: "from-lime-600 via-green-700 to-emerald-950" },
  { id: "pirate", name: "Pirata", emoji: "🏴‍☠️", desc: "Tesoros", gradient: "from-yellow-600 via-amber-700 to-orange-950" },
  { id: "candy", name: "Dulce", emoji: "🍬", desc: "Caramelos", gradient: "from-pink-500 via-fuchsia-600 to-purple-900" },
  { id: "vegas", name: "Vegas", emoji: "🎲", desc: "Casino", gradient: "from-red-500 via-rose-600 to-pink-900" },
  { id: "norse", name: "Nórdico", emoji: "⚡", desc: "Vikingos", gradient: "from-sky-500 via-blue-700 to-slate-900" },
  { id: "japan", name: "Japón", emoji: "🎎", desc: "Sakura", gradient: "from-rose-400 via-pink-600 to-red-900" },
  { id: "maya", name: "Maya", emoji: "🗿", desc: "Templos", gradient: "from-stone-500 via-amber-700 to-yellow-950" },
  { id: "cyber", name: "Cyber", emoji: "🤖", desc: "Futuro", gradient: "from-cyan-400 via-blue-600 to-indigo-950" },
  { id: "horror", name: "Horror", emoji: "👻", desc: "Terror", gradient: "from-purple-800 via-violet-900 to-black" },
  { id: "western", name: "Western", emoji: "🤠", desc: "Far West", gradient: "from-amber-600 via-orange-700 to-yellow-950" },
  { id: "magic", name: "Magia", emoji: "🪄", desc: "Hechizos", gradient: "from-violet-500 via-purple-700 to-fuchsia-950" },
  { id: "sport", name: "Deporte", emoji: "⚽", desc: "Fútbol", gradient: "from-green-500 via-emerald-700 to-teal-950" },
  { id: "gold", name: "Oro", emoji: "👑", desc: "Riqueza", gradient: "from-yellow-400 via-amber-600 to-yellow-900" },
  { id: "ice", name: "Hielo", emoji: "❄️", desc: "Ártico", gradient: "from-sky-300 via-cyan-600 to-blue-950" },
  { id: "dragon", name: "Dragón", emoji: "🐉", desc: "Orientales", gradient: "from-red-600 via-orange-700 to-yellow-900" },
  { id: "fruit", name: "Frutal", emoji: "🍉", desc: "Frutas", gradient: "from-green-400 via-lime-600 to-emerald-900" },
  { id: "neon", name: "Neón", emoji: "💜", desc: "Luces", gradient: "from-fuchsia-500 via-pink-600 to-purple-950" },
  { id: "lucky", name: "Suerte", emoji: "🍀", desc: "Tréboles", gradient: "from-green-500 via-emerald-600 to-green-950" },
  { id: "diamond", name: "Diamante", emoji: "💍", desc: "Joyas", gradient: "from-blue-400 via-indigo-600 to-violet-950" },
  { id: "party", name: "Fiesta", emoji: "🎉", desc: "Celebración", gradient: "from-pink-500 via-rose-600 to-orange-800" },
  { id: "mystic", name: "Místico", emoji: "🔮", desc: "Oráculo", gradient: "from-indigo-500 via-purple-700 to-slate-950" },
  { id: "safari", name: "Safari", emoji: "🦒", desc: "África", gradient: "from-yellow-500 via-amber-700 to-orange-950" },
  { id: "galaxy", name: "Galaxia", emoji: "🌌", desc: "Universo", gradient: "from-violet-600 via-indigo-800 to-black" },
  { id: "carnival", name: "Carnaval", emoji: "🎭", desc: "Fiesta", gradient: "from-yellow-400 via-orange-500 to-red-700" },
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
      <main className="mx-auto max-w-lg px-3 py-4">
        <Link href="/" className="mb-3 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#e8c547]">
          ← Volver
        </Link>

        <h1 className="mb-1 text-center text-xl font-bold text-[#e8c547]">🎰 Tragamonedas</h1>
        <p className="mb-4 text-center text-xs text-zinc-500">{MACHINES.length} máquinas disponibles</p>

        <div className="grid grid-cols-3 gap-2">
          {MACHINES.map((m) => (
            <Link
              key={m.id}
              href={`/slots/${m.id}`}
              className="game-card relative overflow-hidden rounded-xl border border-white/5"
            >
              <div className={`aspect-square bg-gradient-to-br ${m.gradient} flex flex-col items-center justify-center p-2`}>
                <span className="text-2xl drop-shadow-lg">{m.emoji}</span>
                <span className="mt-1 text-[11px] font-bold text-white text-center leading-tight">{m.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
