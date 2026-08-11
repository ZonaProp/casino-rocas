"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCasino } from "@/context/CasinoContext";
import Link from "next/link";

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
interface Card { suit: Suit; rank: Rank; }

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ suit, rank });
  return deck.sort(() => Math.random() - 0.5);
}

function cardValue(card: Card): number {
  if (["J", "Q", "K"].includes(card.rank)) return 10;
  if (card.rank === "A") return 11;
  return parseInt(card.rank);
}

function handValue(hand: Card[]): number {
  let value = hand.reduce((sum, c) => sum + cardValue(c), 0);
  let aces = hand.filter(c => c.rank === "A").length;
  while (value > 21 && aces > 0) { value -= 10; aces--; }
  return value;
}

function CardView({ card, hidden = false }: { card: Card; hidden?: boolean }) {
  if (hidden) return <div className="flex h-20 w-14 items-center justify-center rounded-lg border-2 border-[#f5c542]/50 bg-blue-950 text-2xl">?</div>;
  const isRed = card.suit === "♥" || card.suit === "♦";
  return (
    <div className={`flex h-20 w-14 flex-col items-center justify-center rounded-lg border border-zinc-600 bg-white shadow ${isRed ? "text-red-600" : "text-black"}`}>
      <span className="text-lg font-bold leading-none">{card.rank}</span>
      <span className="text-xl leading-none">{card.suit}</span>
    </div>
  );
}

export default function BlackjackPage() {
  const { user, placeBet, isLoading } = useCasino();
  const router = useRouter();
  const [bet, setBet] = useState(100);
  const [deck, setDeck] = useState<Card[]>([]);
  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [message, setMessage] = useState("");
  const [hideDealer, setHideDealer] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push("/");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f5c542] border-t-transparent" /></div>;
  }

  const startGame = () => {
    if (user.balance < bet) return;
    const newDeck = createDeck();
    const p = [newDeck.pop()!, newDeck.pop()!];
    const d = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayer(p);
    setDealer(d);
    setHideDealer(true);
    setStatus("playing");
    setMessage("");
    if (handValue(p) === 21) endGame(p, d, true);
  };

  const hit = () => {
    if (status !== "playing" || deck.length === 0) return;
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newPlayer = [...player, card];
    setDeck(newDeck);
    setPlayer(newPlayer);
    if (handValue(newPlayer) > 21) endGame(newPlayer, dealer, false);
  };

  const stand = () => {
    if (status !== "playing") return;
    let newDealer = [...dealer];
    let newDeck = [...deck];
    setHideDealer(false);
    while (handValue(newDealer) < 17) {
      newDealer = [...newDealer, newDeck.pop()!];
    }
    setDealer(newDealer);
    setDeck(newDeck);
    endGame(player, newDealer, false);
  };

  const endGame = (pHand: Card[], dHand: Card[], natural: boolean) => {
    setHideDealer(false);
    setStatus("finished");
    const pVal = handValue(pHand);
    const dVal = handValue(dHand);
    let net = 0;
    let msg = "";
    if (pVal > 21) { net = -bet; msg = "Te pasaste. Perdiste."; }
    else if (natural && pVal === 21) { net = Math.floor(bet * 1.5); msg = "¡Blackjack! Ganás 3:2"; }
    else if (dVal > 21) { net = bet; msg = "El crupier se pasó. ¡Ganaste!"; }
    else if (pVal > dVal) { net = bet; msg = "¡Ganaste!"; }
    else if (pVal < dVal) { net = -bet; msg = "Perdiste."; }
    else { net = 0; msg = "Empate (push)."; }
    placeBet("blackjack", bet, net, msg);
    setMessage(msg + ` (${net >= 0 ? "+" : ""}$${net.toLocaleString("es-AR")})`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8">
        <Link href="/" className="mb-6 inline-flex text-sm text-zinc-400 hover:text-[#f5c542]">← Volver al lobby</Link>
        <h1 className="mb-6 text-center text-3xl font-bold text-[#f5c542]">🃏 Blackjack</h1>

        <div className="mb-8">
          <p className="mb-2 text-center text-sm text-zinc-400">Crupier {status !== "idle" && !hideDealer ? `(${handValue(dealer)})` : ""}</p>
          <div className="flex justify-center gap-2">
            {dealer.map((c, i) => <CardView key={i} card={c} hidden={hideDealer && i === 1} />)}
            {dealer.length === 0 && <div className="h-20 w-14 rounded-lg border border-dashed border-zinc-600" />}
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-2 text-center text-sm text-zinc-400">Vos {player.length > 0 ? `(${handValue(player)})` : ""}</p>
          <div className="flex justify-center gap-2">
            {player.map((c, i) => <CardView key={i} card={c} />)}
            {player.length === 0 && <div className="h-20 w-14 rounded-lg border border-dashed border-zinc-600" />}
          </div>
        </div>

        {message && (
          <p className={`mb-4 text-center text-lg font-semibold ${
            message.includes("Ganaste") || message.includes("Blackjack") ? "text-emerald-400" : message.includes("Empate") ? "text-zinc-300" : "text-red-400"
          }`}>{message}</p>
        )}

        {status === "idle" || status === "finished" ? (
          <>
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {[50,100,250,500,1000].map(b => (
                <button key={b} onClick={() => setBet(b)} className={`rounded-lg px-3 py-1.5 text-sm ${bet === b ? "bg-[#f5c542] text-black" : "bg-[#1a1a28] text-zinc-300"}`}>${b}</button>
              ))}
            </div>
            <button onClick={startGame} disabled={user.balance < bet} className="w-full rounded-xl bg-gradient-to-r from-[#f5c542] to-[#c9a227] py-4 text-lg font-bold text-black disabled:opacity-40">
              Repartir · ${bet.toLocaleString("es-AR")}
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <button onClick={hit} className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white">Pedir</button>
            <button onClick={stand} className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white">Plantarse</button>
          </div>
        )}
      </main>
    </div>
  );
}
