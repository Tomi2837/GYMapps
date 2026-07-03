"use client";

import { useSearchParams } from "next/navigation";

const GOOGLE_MESSAGES: Record<string, string> = {
  not_configured: "Falta configurar el acceso con Google en Vercel.",
  invalid_state: "La validacion de Google vencio. Intenta nuevamente.",
  missing_identity: "Google no devolvio los datos de la cuenta.",
  unverified_email: "La cuenta de Google no tiene un email verificado.",
  not_registered: "Ese email de Google todavia no esta registrado en el gimnasio.",
  failed: "No se pudo completar el acceso con Google.",
};

export function GoogleLogin() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("google");
  const message = reason ? GOOGLE_MESSAGES[reason] : null;

  return (
    <div>
      <a
        href="/api/auth/google"
        className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white font-bold text-[#111827] shadow-sm transition hover:bg-gray-50"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-lg font-black text-blue-600 shadow">G</span>
        Continuar con Google
      </a>

      {message && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          {message}
        </div>
      )}
    </div>
  );
}
