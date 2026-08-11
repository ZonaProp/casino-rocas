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
      <div className="w-full max-w-md rounded-2xl border border-[#2a2a3a] bg-[#14141f] p-8 shadow-2xl glow-gold">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#f5c542] text-glow">
            Casino Rocas
          </h1>
          <p className="mt-2 text-zinc-400">
            Casino virtual · Solo entretenimiento · Sin dinero real
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: JuanRocas"
              maxLength={20}
              className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-[#f5c542] focus:ring-1 focus:ring-[#f5c542]"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-[#f5c542] to-[#c9a227] py-3.5 font-bold text-black transition hover:brightness-110 disabled:opacity-40"
          >
            Entrar al Casino
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Empezás con <span className="text-[#f5c542]">$10.000</span> monedas virtuales.
          <br />
          Todo se guarda en este dispositivo.
        </p>
      </div>
    </div>
  );
}
