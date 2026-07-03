"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "No se pudo iniciar sesion.");
        return;
      }

      router.push(data.redirectTo ?? "/dashboard");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          placeholder="nombre@gimnasio.com"
          className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 outline-none transition focus:border-[#111827] focus:bg-white"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700">Contrasena</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 outline-none transition focus:border-[#111827] focus:bg-white"
        />
      </label>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#111827] px-5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
