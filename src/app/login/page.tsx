import Link from "next/link";
import { Suspense } from "react";
import { GoogleLogin } from "./google-login";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl shadow-black/10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[700px] overflow-hidden bg-[#111827] p-12 text-white md:flex md:flex-col md:justify-between">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#b8ff39]/20 blur-3xl" />
          <div className="relative">
            <div className="mb-10 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#b8ff39] font-black text-[#111827]">G</div>
              <div>
                <p className="font-bold">GYM Control</p>
                <p className="text-sm text-white/55">Gestion integral</p>
              </div>
            </div>
            <h1 className="max-w-md text-5xl font-black leading-[1.05] tracking-tight">Tu gimnasio, ordenado en un solo lugar.</h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/65">
              Socios, pagos, ingresos, rutinas y estadisticas desde una plataforma moderna e instalable.
            </p>
          </div>
          <div className="relative grid grid-cols-3 gap-3">
            {["Socios", "Pagos", "Check-in"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-white/80">{item}</div>
            ))}
          </div>
        </div>

        <div className="flex min-h-[700px] flex-col justify-center p-7 sm:p-12">
          <div className="mb-9 md:hidden">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#b8ff39] font-black text-[#111827]">G</div>
              <p className="font-bold">GYM Control</p>
            </div>
          </div>

          <div className="max-w-md">
            <span className="inline-flex rounded-full bg-[#b8ff39]/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#33430d]">Acceso al sistema</span>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-[#111827]">Bienvenido</h2>
            <p className="mt-3 text-base leading-7 text-gray-500">Ingresa con el acceso administrador o con una cuenta autorizada por el gimnasio.</p>

            <Suspense
              fallback={(
                <div className="mt-8 h-14 w-full animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
              )}
            >
              <GoogleLogin />
            </Suspense>

            <div className="my-6 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-gray-300">
              <span className="h-px flex-1 bg-gray-200" /> o <span className="h-px flex-1 bg-gray-200" />
            </div>

            <LoginForm />

            <div className="mt-7 rounded-2xl border border-[#b8ff39]/60 bg-[#b8ff39]/15 p-4 text-center">
              <p className="text-sm font-bold text-[#25320c]">Primera vez en el sistema?</p>
              <Link href="/onboarding" className="mt-2 inline-flex text-sm font-black text-[#111827] underline decoration-2 underline-offset-4">Crear administrador y configurar gimnasio</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
