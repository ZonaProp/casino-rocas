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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f5c542] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const games = [
    {
      id: "slots",
      name: "Tragamonedas",
      description: "Girá los rodillos y ganá combinaciones",
      emoji: "🎰",
      href: "/slots",
      color: "from-purple-600/20 to-pink-600/20 border-purple-500/40",
    },
    {
      id: "ruleta",
      name: "Ruleta Europea",
      description: "Apostá al número, color o docena",
      emoji: "🎡",
      href: "/ruleta",
      color: "from-red-600/20 to-rose-600/20 border-red-500/40",
    },
    {
      id: "blackjack",
      name: "Blackjack",
      description: "Llegá a 21 sin pasarte",
      emoji: "🃏",
      href: "/blackjack",
      color: "from-emerald-600/20 to-teal-600/20 border-emerald-500/40",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">
            ¡Bienvenido, <span className="text-[#f5c542]">{user.username}</span>!
          </h2>
          <p className="mt-2 text-zinc-400">Elegí un juego y probá tu suerte</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.id}
              href={game.href}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${game.color} p-6 transition-all hover:scale-[1.02] hover:shadow-xl`}
            >
              <div className="text-5xl mb-4">{game.emoji}</div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#f5c542] transition">
                {game.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">{game.description}</p>
              <div className="mt-4 text-sm font-medium text-[#f5c542] opacity-0 group-hover:opacity-100 transition">
                Jugar →
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <span>📜</span>
            <h3 className="text-lg font-semibold text-white">Últimas jugadas</h3>
          </div>

          {history.length === 0 ? (
            <p className="rounded-xl border border-[#2a2a3a] bg-[#14141f] p-6 text-center text-zinc-500">
              Todavía no jugaste nada. ¡Empezá con un juego!
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#2a2a3a] bg-[#14141f]">
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#1a1a28] text-left text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Juego</th>
                      <th className="px-4 py-3 font-medium">Apuesta</th>
                      <th className="px-4 py-3 font-medium">Resultado</th>
                      <th className="px-4 py-3 font-medium hidden sm:table-cell">Detalle</th>
                      <th className="px-4 py-3 font-medium">Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 20).map((h) => (
                      <tr key={h.id} className="border-t border-[#2a2a3a]">
                        <td className="px-4 py-3 capitalize">
                          {h.game === "slots" ? "Tragamonedas" : h.game === "ruleta" ? "Ruleta" : "Blackjack"}
                        </td>
                        <td className="px-4 py-3">${h.bet.toLocaleString("es-AR")}</td>
                        <td className={`px-4 py-3 font-medium ${h.result >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {h.result >= 0 ? "+" : ""}${h.result.toLocaleString("es-AR")}
                        </td>
                        <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell max-w-[200px] truncate">
                          {h.details}
                        </td>
                        <td className="px-4 py-3 text-zinc-500">
                          {new Date(h.timestamp).toLocaleTimeString("es-AR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-16 border-t border-[#2a2a3a] py-6 text-center text-xs text-zinc-600">
        Casino Rocas · Solo entretenimiento · No se juega con dinero real · 2026
      </footer>
    </div>
  );
}
