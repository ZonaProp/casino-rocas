"use client";

import { useCasino } from "@/context/CasinoContext";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";
import Link from "next/link";

export default function HomePage() {
  const { user, history, isLoading } = useCasino();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8c547] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const topGames = [
    {
      id: "crash",
      name: "Crash",
      emoji: "🚀",
      href: "/crash",
      badge: "HOT",
      gradient: "from-orange-600 via-red-600 to-rose-700",
    },
    {
      id: "mines",
      name: "Mines",
      emoji: "💣",
      href: "/mines",
      badge: "TOP",
      gradient: "from-amber-500 via-yellow-600 to-orange-700",
    },
    {
      id: "slots",
      name: "Tragamonedas",
      emoji: "🎰",
      href: "/slots",
      gradient: "from-purple-600 via-fuchsia-600 to-pink-700",
    },
    {
      id: "ruleta",
      name: "Ruleta",
      emoji: "🎡",
      href: "/ruleta",
      gradient: "from-red-600 via-rose-600 to-red-800",
    },
  ];

  const tableGames = [
    {
      id: "blackjack",
      name: "Blackjack",
      emoji: "🃏",
      href: "/blackjack",
      gradient: "from-emerald-700 via-teal-700 to-green-900",
    },
    {
      id: "ruleta2",
      name: "Ruleta Europea",
      emoji: "🔴",
      href: "/ruleta",
      gradient: "from-red-700 via-red-800 to-black",
    },
  ];

  const gameName = (g: string) => {
    const map: Record<string, string> = {
      slots: "Tragamonedas",
      ruleta: "Ruleta",
      blackjack: "Blackjack",
      crash: "Crash",
      mines: "Mines",
    };
    return map[g] || g;
  };

  return (
    <div className="min-h-screen pb-nav">
      <Header />

      <main className="mx-auto max-w-6xl px-3 py-4">
        {/* Banner */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#e8c547]/20 bg-gradient-to-r from-[#1a150f] via-[#2a1f12] to-[#1a150f]">
          <div className="relative px-5 py-8 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,197,71,0.15),transparent_70%)]" />
            <h2 className="relative text-2xl font-bold text-[#e8c547] text-glow">
              ♛ Casino Rocas
            </h2>
            <p className="relative mt-1 text-sm text-zinc-400">
              Hola, <span className="text-[#e8c547]">{user.username}</span> · Solo entretenimiento
            </p>
          </div>
        </div>

        {/* Top / Populares */}
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#e8c547]">
              <span className="h-2 w-2 rounded-full bg-[#e8c547]" />
              Top / Populares
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {topGames.map((game) => (
              <Link
                key={game.id}
                href={game.href}
                className="game-card group relative overflow-hidden rounded-xl border border-[#2a241c]"
              >
                <div className={`aspect-square bg-gradient-to-br ${game.gradient} flex flex-col items-center justify-center p-3`}>
                  {game.badge && (
                    <span className="absolute top-2 right-2 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {game.badge}
                    </span>
                  )}
                  <span className="text-4xl drop-shadow-lg">{game.emoji}</span>
                  <span className="mt-2 text-sm font-bold text-white drop-shadow-md text-center leading-tight">
                    {game.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Juegos de mesa */}
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#e8c547]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Juegos de mesa
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tableGames.map((game) => (
              <Link
                key={game.id}
                href={game.href}
                className="game-card group relative overflow-hidden rounded-xl border border-[#2a241c]"
              >
                <div className={`aspect-square bg-gradient-to-br ${game.gradient} flex flex-col items-center justify-center p-3`}>
                  <span className="text-4xl drop-shadow-lg">{game.emoji}</span>
                  <span className="mt-2 text-sm font-bold text-white drop-shadow-md text-center leading-tight">
                    {game.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Historial */}
        <section className="mb-4">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-400">Últimas jugadas</h3>
          </div>

          {history.length === 0 ? (
            <p className="rounded-xl border border-[#2a241c] bg-[#16120e] p-5 text-center text-sm text-zinc-500">
              Todavía no jugaste. ¡Elegí un juego arriba!
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#2a241c] bg-[#16120e]">
              <div className="max-h-52 overflow-y-auto">
                {history.slice(0, 12).map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between border-b border-[#2a241c]/60 px-4 py-2.5 text-sm last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-300">{gameName(h.game)}</span>
                      <span className="text-xs text-zinc-500">
                        ${h.bet.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <span className={`font-medium ${h.result >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {h.result >= 0 ? "+" : ""}${h.result.toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2a241c] bg-[#0c0a08]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          <Link href="/" className="flex flex-col items-center gap-0.5 px-3 py-1 text-[#e8c547]">
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-medium">Inicio</span>
          </Link>
          <Link href="/slots" className="flex flex-col items-center gap-0.5 px-3 py-1 text-zinc-500 hover:text-[#e8c547]">
            <span className="text-xl">🎰</span>
            <span className="text-[10px] font-medium">Slots</span>
          </Link>
          <Link href="/crash" className="flex flex-col items-center gap-0.5 px-3 py-1 text-zinc-500 hover:text-[#e8c547]">
            <span className="text-xl">🚀</span>
            <span className="text-[10px] font-medium">Crash</span>
          </Link>
          <Link href="/mines" className="flex flex-col items-center gap-0.5 px-3 py-1 text-zinc-500 hover:text-[#e8c547]">
            <span className="text-xl">💣</span>
            <span className="text-[10px] font-medium">Mines</span>
          </Link>
          <Link href="/ruleta" className="flex flex-col items-center gap-0.5 px-3 py-1 text-zinc-500 hover:text-[#e8c547]">
            <span className="text-xl">🎡</span>
            <span className="text-[10px] font-medium">Ruleta</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
