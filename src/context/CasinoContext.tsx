"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, HistoryEntry, GameType } from "@/lib/types";
import {
  getUser,
  saveUser,
  clearUser,
  getHistory,
  addHistory,
  updateBalance,
} from "@/lib/storage";

interface CasinoContextType {
  user: User | null;
  history: HistoryEntry[];
  isLoading: boolean;
  login: (username: string) => void;
  logout: () => void;
  addBalance: (amount: number) => void;
  placeBet: (game: GameType, bet: number, netChange: number, details: string) => boolean;
  refresh: () => void;
}

const CasinoContext = createContext<CasinoContextType | null>(null);

export function CasinoProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setUser(getUser());
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const login = (username: string) => {
    const clean = username.trim().slice(0, 20);
    if (!clean) return;
    const newUser: User = {
      id: crypto.randomUUID(),
      username: clean,
      balance: 10000,
      createdAt: new Date().toISOString(),
    };
    saveUser(newUser);
    setUser(newUser);
    setHistory([]);
  };

  const logout = () => {
    clearUser();
    setUser(null);
    setHistory([]);
  };

  const addBalance = (amount: number) => {
    const updated = updateBalance(amount);
    if (updated) setUser({ ...updated });
  };

  const placeBet = (game: GameType, bet: number, netChange: number, details: string): boolean => {
    const current = getUser();
    if (!current || current.balance < bet) return false;

    const updated = updateBalance(netChange);
    if (!updated) return false;

    addHistory({
      game,
      bet,
      result: netChange,
      details,
    });

    setUser({ ...updated });
    setHistory(getHistory());
    return true;
  };

  return (
    <CasinoContext.Provider
      value={{
        user,
        history,
        isLoading,
        login,
        logout,
        addBalance,
        placeBet,
        refresh,
      }}
    >
      {children}
    </CasinoContext.Provider>
  );
}

export function useCasino() {
  const ctx = useContext(CasinoContext);
  if (!ctx) throw new Error("useCasino must be used within CasinoProvider");
  return ctx;
}
