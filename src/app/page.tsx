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
      gradient: "from-orange-500 via-red-600 to-rose-800",
    },
    {
      id: "mines",
      name: "Mines",
      emoji: "💣",
      href: "/mines",
      badge: "TOP",
      gradient: "from-amber-400 via-yellow-600 to-orange-800",
    },
    {
      id: "plinko",
      name: "Plinko",
      emoji: "🎱",
      href: "/plinko",
      badge: "NEW",
      gradient: "from-cyan-500 via-blue-600 to-indigo-800",
    },
    {
      id: "slots",
      name: "Slots",
      emoji: "🎰",
      href: "/slots",
      gradient: "from-purple-500 via-fuchsia-600 to-pink-800",
    },
  ];

  const tableGames = [
    {
      id: "ruleta",
      name: "Ruleta",
      emoji: "🎡",
      href: "/ruleta",
      gradient: "from-red-600 via-rose-700 to-red-950",
    },
    {
      id: "blackjack",
      name: "Blackjack",
      emoji: "🃏",
      href: "/blackjack",
      gradient: "from-emerald-600 via-teal-700 to-green-950",
    },
  ];

  const gameName = (g: string) => {
    const map: Record<string, string> = {
      slots: "Slots",
      ruleta: "Ruleta",
      blackjack: "Blackjack",
      crash: "Crash",
      mines: "Mines",
      plinko: "Plinko",
    };
    return map[g] || g;
  };

  return (
    <div className="min-h-screen pb-nav">
      <Header />

      <main className="mx-auto max-w-6xl px-3 py-4">
        {/* Banner */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#e8c547]/30 bg-gradient-to-br from-[#1a1408] via-[#2a1c0a] to-[#0c0a08]">
          <div className="relative px-4 py-7 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(232,197,71,0.2),transparent_60%)]" />
            <div className="relative text-3xl mb-1">♛</div>
            <h2 className="relative text-xl font-bold text-[#e8c547] text-glow">
              Casino Rocas
            </h2>
            <p className="relative mt-1 text-xs text-zinc-400">
              Hola <span className="text-[#e8c547] font-medium">{user.username}</span> · Solo entretenimiento
            </p>
          </div>
        </div>

        {/* Top */}
        <section className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8c547]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#e8c547]">
              Populares
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {topGames.map((game) => (
              <Link
                key={game.id}
                href={game.href}
                className="game-card relative overflow-hidden rounded-xl border border-white/5"
              >
                <div className={`aspect-[4/5] bg-gradient-to-br ${game.gradient} flex flex-col items-center justify-center p-3 relative`}>
                  {game.badge && (
                    <span className="absolute top-1.5 right-1.5 rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                      {game.badge}
                    </span>
                  )}
                  <span className="text-4xl drop-shadow-xl">{game.emoji}</span>
                  <span className="mt-2 text-sm font-bold text-white drop-shadow-md">
                    {game.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mesa */}
        <section className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Mesa
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {tableGames.map((game) => (
              <Link
                key={game.id}
                href={game.href}
                className="game-card relative overflow-hidden rounded-xl border border-white/5"
              >
                <div className={`aspect-[4/5] bg-gradient-to-br ${game.gradient} flex flex-col items-center justify-center p-3`}>
                  <span className="text-4xl drop-shadow-xl">{game.emoji}</span>
                  <span className="mt-2 text-sm font-bold text-white drop-shadow-md">
                    {game.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Historial */}
        <section className="mb-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Últimas jugadas
          </h3>

          {history.length === 0 ? (
            <p className="rounded-xl border border-[#2a241c] bg-[#16120e]/80 p-4 text-center text-sm text-zinc-500">
              Todavía no jugaste
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#2a241c] bg-[#16120e]/80">
              <div className="max-h-44 overflow-y-auto">
                {history.slice(0, 10).map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between border-b border-[#2a241c]/50 px-3 py-2 text-sm last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300">{gameName(h.game)}</span>
                      <span className="text-[11px] text-zinc-600">
                        ${h.bet.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <span className={`font-medium text-sm ${h.result >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {h.result >= 0 ? "+" : ""}${h.result.toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2a241c] bg-[#0c0a08]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-1.5">
          <Link href="/" className="flex flex-col items-center gap-0.5 px-2.5 py-1 text-[#e8c547]">
            <span className="text-lg">🏠</span>
            <span className="text-[9px] font-medium">Inicio</span>
          </Link>
          <Link href="/crash" className="flex flex-col items-center gap-0.5 px-2.5 py-1 text-zinc-500">
            <span className="text-lg">🚀</span>
            <span className="text-[9px] font-medium">Crash</span>
          </Link>
          <Link href="/mines" className="flex flex-col items-center gap-0.5 px-2.5 py-1 text-zinc-500">
            <span className="text-lg">💣</span>
            <span className="text-[9px] font-medium">Mines</span>
          </Link>
          <Link href="/plinko" className="flex flex-col items-center gap-0.5 px-2.5 py-1 text-zinc-500">
            <span className="text-lg">🎱</span>
            <span className="text-[9px] font-medium">Plinko</span>
          </Link>
          <Link href="/slots" className="flex flex-col items-center gap-0.5 px-2.5 py-1 text-zinc-500">
            <span className="text-lg">🎰</span>
            <span className="text-[9px] font-medium">Slots</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
