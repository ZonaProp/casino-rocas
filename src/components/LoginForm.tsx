"use client";

import { useState } from "react";
import { useCasino } from "@/context/CasinoContext";

export default function LoginForm() {
  const { login } = useCasino();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e8c547]/25 bg-[#16120e] p-8 shadow-2xl glow-gold">
        <div className="mb-8 text-center">
          <div className="mb-2 text-3xl">♛</div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e8c547] text-glow">
            Casino Rocas
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Casino virtual · Solo entretenimiento
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre"
              maxLength={20}
              className="w-full rounded-xl border border-[#2a241c] bg-[#0c0a08] px-4 py-3.5 text-white placeholder-zinc-500 outline-none transition focus:border-[#e8c547] focus:ring-1 focus:ring-[#e8c547]"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-[#e8c547] to-[#c9a227] py-3.5 font-bold text-black transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Acceso
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Empezás con <span className="text-[#e8c547]">$10.000</span> monedas virtuales
        </p>
      </div>
    </div>
  );
}
