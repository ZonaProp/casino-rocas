export interface User {
  id: string;
  username: string;
  balance: number;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  game: "slots" | "ruleta" | "blackjack" | "crash" | "mines";
  bet: number;
  result: number; // positive = win, negative = loss
  details: string;
  timestamp: string;
}

export type GameType = "slots" | "ruleta" | "blackjack" | "crash" | "mines";
