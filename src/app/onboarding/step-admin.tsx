import type { AdminSetup } from "./types";

export function StepAdmin({ value, onChange }: { value: AdminSetup; onChange: (value: AdminSetup) => void }) {
  const googleConnected = value.provider === "google";

  return (
    <div>
      <span className="inline-flex rounded-full bg-[#b8ff39]/30 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#33430d]">
        Administrador principal
      </span>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Crea tu acceso</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">
        Este usuario tendra control total y podra crear recepcionistas y entrenadores.
      </p>

      <a
        href="/api/auth/google?mode=setup"
        className={`mt-8 flex h-14 w-full max-w-xl items-center justify-center gap-3 rounded-2xl border font-bold shadow-sm transition ${
          googleConnected
            ? "border-green-200 bg-green-50 text-green-800"
            : "border-gray-200 bg-white text-[#111827] hover:bg-gray-50"
        }`}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-lg font-black text-blue-600 shadow">G</span>
        {googleConnected ? "Cuenta de Google conectada" : "Continuar con Google"}
      </a>

      <div className="my-7 flex max-w-xl items-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-gray-300">
        <span className="h-px flex-1 bg-gray-200" />
        {googleConnected ? "datos verificados" : "o registrar email"}
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid max-w-xl gap-5">
        <label>
          <span className="mb-2 block text-sm font-bold text-gray-700">Nombre completo</span>
          <input
            value={value.name}
            disabled={googleConnected}
            onChange={(event) => onChange({ ...value, name: event.target.value })}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 outline-none transition focus:border-[#111827] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            placeholder="Ej. Tomas Bonomo"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-gray-700">Email</span>
          <input
            type="email"
            value={value.email}
            disabled={googleConnected}
            onChange={(event) => onChange({ ...value, email: event.target.value })}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 outline-none transition focus:border-[#111827] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            placeholder="admin@gimnasio.com"
          />
        </label>

        {!googleConnected && (
          <label>
            <span className="mb-2 block text-sm font-bold text-gray-700">Contrasena</span>
            <input
              type="password"
              value={value.password}
              onChange={(event) => onChange({ ...value, password: event.target.value })}
              className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 outline-none transition focus:border-[#111827] focus:bg-white"
              placeholder="Minimo 8 caracteres"
            />
          </label>
        )}
      </div>

      <p className="mt-5 max-w-xl text-xs leading-5 text-gray-400">
        Con Google no necesitas crear una contrasena adicional para este sistema.
      </p>
    </div>
  );
}
