"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCasino } from "@/context/CasinoContext";
import Link from "next/link";

const GRID_SIZE = 25;

function getMultiplier(mines: number, revealed: number): number {
  if (revealed === 0) return 1;
  let multi = 1;
  for (let i = 0; i < revealed; i++) {
    multi *= (GRID_SIZE - mines - i) / (GRID_SIZE - i);
  }
  // ~3% house edge
  return Math.max(1.01, Math.floor(multi * 0.97 * 100) / 100);
}

type Tile = {
  isMine: boolean;
  revealed: boolean;
};

export default function MinesPage() {
  const { user, placeBet, isLoading } = useCasino();
  const router = useRouter();
  const [bet, setBet] = useState(100);
  const [minesCount, setMinesCount] = useState(3);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/");
  }, [user, isLoading, router]);

  const resetGrid = useCallback(() => {
    setTiles(Array(GRID_SIZE).fill(null).map(() => ({ isMine: false, revealed: false })));
    setRevealedCount(0);
    setGameActive(false);
    setGameOver(false);
    setWon(false);
    setMessage("");
  }, []);

  useEffect(() => {
    resetGrid();
  }, [resetGrid]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f5c542] border-t-transparent" />
      </div>
    );
  }

  const currentMulti = getMultiplier(minesCount, revealedCount);
  const potentialWin = Math.floor(bet * currentMulti);

  const startGame = () => {
    if (user.balance < bet || gameActive) return;

    const positions = Array.from({ length: GRID_SIZE }, (_, i) => i);
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    const minePositions = new Set(positions.slice(0, minesCount));

    const newTiles: Tile[] = Array(GRID_SIZE).fill(null).map((_, i) => ({
      isMine: minePositions.has(i),
      revealed: false,
    }));

    setTiles(newTiles);
    setRevealedCount(0);
    setGameActive(true);
    setGameOver(false);
    setWon(false);
    setMessage("¡Elegí una casilla!");
  };

  const revealTile = (index: number) => {
    if (!gameActive || gameOver || tiles[index].revealed) return;

    const newTiles = [...tiles];
    newTiles[index] = { ...newTiles[index], revealed: true };
    setTiles(newTiles);

    if (newTiles[index].isMine) {
      setGameActive(false);
      setGameOver(true);
      setWon(false);
      setMessage("💥 ¡Mina! Perdiste");
      setTiles(newTiles.map(t => ({ ...t, revealed: t.isMine ? true : t.revealed })));
      placeBet("mines", bet, -bet, `Mines ${minesCount} · Hit mine`);
    } else {
      const newRevealed = revealedCount + 1;
      setRevealedCount(newRevealed);
      const multi = getMultiplier(minesCount, newRevealed);
      setMessage(`x${multi.toFixed(2)} · ¡Seguí o cobrá!`);

      if (newRevealed === GRID_SIZE - minesCount) {
        cashOut(newRevealed);
      }
    }
  };

  const cashOut = (revealed = revealedCount) => {
    if (!gameActive || revealed === 0) return;
    const multi = getMultiplier(minesCount, revealed);
    const win = Math.floor(bet * multi);
    const net = win - bet;

    placeBet("mines", bet, net, `Mines ${minesCount} · ${revealed} safe · x${multi.toFixed(2)}`);

    setGameActive(false);
    setGameOver(true);
    setWon(true);
    setMessage(`¡Cobrado! +$${win.toLocaleString("es-AR")} (x${multi.toFixed(2)})`);
    setTiles(prev => prev.map(t => ({ ...t, revealed: true })));
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-6">
        <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#f5c542]">
          ← Volver al lobby
        </Link>

        <h1 className="mb-6 text-center text-3xl font-bold text-[#f5c542]">💣 Mines</h1>

        <div className="mb-4 text-center">
          <div className={`text-4xl font-bold ${gameActive ? "text-emerald-400" : "text-zinc-500"}`}>
            x{currentMulti.toFixed(2)}
          </div>
          {gameActive && (
            <p className="text-sm text-zinc-400">
              Ganancia potencial: ${potentialWin.toLocaleString("es-AR")}
            </p>
          )}
        </div>

        <div className="mb-6 grid grid-cols-5 gap-2">
          {tiles.map((tile, i) => (
            <button
              key={i}
              onClick={() => revealTile(i)}
              disabled={!gameActive || tile.revealed || gameOver}
              className={`
                aspect-square rounded-xl text-2xl font-bold transition-all
                ${
                  tile.revealed
                    ? tile.isMine
                      ? "bg-red-600/80 border-red-500"
                      : "bg-emerald-600/30 border-emerald-500/50"
                    : "bg-[#1a1a28] border border-[#2a2a3a] hover:border-[#f5c542]/60 hover:bg-[#22223a] active:scale-95"
                }
                ${!gameActive && !tile.revealed ? "opacity-60" : ""}
              `}
            >
              {tile.revealed ? (tile.isMine ? "💣" : "💎") : ""}
            </button>
          ))}
        </div>

        {message && (
          <p className={`mb-4 text-center text-lg font-semibold ${
            won ? "text-emerald-400" : gameOver ? "text-red-400" : "text-zinc-300"
          }`}>
            {message}
          </p>
        )}

        {!gameActive && (
          <>
            <div className="mb-4">
              <p className="mb-2 text-center text-sm text-zinc-400">Cantidad de minas</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 3, 5, 7, 10].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMinesCount(m)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      minesCount === m ? "bg-[#f5c542] text-black" : "bg-[#1a1a28] text-zinc-300"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-center text-sm text-zinc-400">Apuesta</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[50, 100, 250, 500, 1000].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBet(b)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                      bet === b ? "bg-[#f5c542] text-black" : "bg-[#1a1a28] text-zinc-300"
                    }`}
                  >
                    ${b}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              disabled={user.balance < bet}
              className="w-full rounded-xl bg-gradient-to-r from-[#f5c542] to-[#c9a227] py-4 text-lg font-bold text-black disabled:opacity-40"
            >
              JUGAR · ${bet.toLocaleString("es-AR")}
            </button>
          </>
        )}

        {gameActive && (
          <button
            onClick={() => cashOut()}
            disabled={revealedCount === 0}
            className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-bold text-white disabled:opacity-40 hover:bg-emerald-500"
          >
            COBRAR · ${potentialWin.toLocaleString("es-AR")}
          </button>
        )}

        {gameOver && (
          <button
            onClick={resetGrid}
            className="mt-3 w-full rounded-xl border border-[#2a2a3a] bg-[#1a1a28] py-3 text-zinc-300 hover:bg-[#22223a]"
          >
            Nueva partida
          </button>
        )}

        <div className="mt-8 rounded-xl border border-[#2a2a3a] bg-[#14141f] p-4 text-sm text-zinc-400">
          <p className="mb-1 font-medium text-zinc-300">Cómo jugar</p>
          <p>Elegí cuántas minas hay. Cada casilla segura aumenta el multiplicador. Cobrá cuando quieras o seguí arriesgando. ¡Si tocás una mina perdés todo!</p>
        </div>
      </main>
    </div>
  );
}
