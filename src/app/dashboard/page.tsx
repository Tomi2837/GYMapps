import Link from "next/link";

const metrics = [
  { label: "Socios activos", value: "248", detail: "+12 este mes" },
  { label: "Ingresos hoy", value: "86", detail: "34% de los activos" },
  { label: "Cuotas vencidas", value: "17", detail: "Requieren seguimiento" },
  { label: "Recaudacion del dia", value: "$ 486.000", detail: "23 pagos registrados" },
];

const modules = [
  { title: "Socios", description: "Altas, bajas, planes y vencimientos", href: "#" },
  { title: "Pagos", description: "Cobros, metodos e historial", href: "#" },
  { title: "Check-in", description: "Accesos y validacion de cuotas", href: "#" },
  { title: "Rutinas", description: "Asignacion y seguimiento", href: "#" },
  { title: "Ejercicios", description: "Biblioteca por grupo muscular", href: "#" },
  { title: "Configuracion", description: "Sucursal, usuarios y permisos", href: "#" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#111827] font-black text-[#b8ff39]">G</div>
            <div>
              <p className="font-black text-[#111827]">GYM Control</p>
              <p className="text-xs text-gray-400">Panel administrativo</p>
            </div>
          </div>
          <Link href="/login" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50">
            Cerrar sesion
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-[#b8ff39]/35 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#33430d]">
              Entorno de demostracion
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Resumen del gimnasio</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
              Vista inicial para controlar socios, ingresos, cuotas y recaudacion desde un solo panel.
            </p>
          </div>
          <button className="h-12 rounded-2xl bg-[#111827] px-5 text-sm font-bold text-white transition hover:bg-black">
            Registrar nuevo socio
          </button>
        </section>

        <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm shadow-black/5">
              <p className="text-sm font-semibold text-gray-500">{metric.label}</p>
              <p className="mt-4 text-3xl font-black tracking-tight text-[#111827]">{metric.value}</p>
              <p className="mt-3 text-xs font-medium text-gray-400">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#111827]">Modulos principales</h2>
                <p className="mt-1 text-sm text-gray-400">La estructura ya esta preparada para crecer por etapas.</p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {modules.map((module) => (
                <a key={module.title} href={module.href} className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:-translate-y-0.5 hover:border-[#b8ff39] hover:bg-white hover:shadow-lg hover:shadow-black/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black text-[#111827]">{module.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-500">{module.description}</p>
                    </div>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-lg transition group-hover:bg-[#b8ff39]">→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <aside className="rounded-[30px] bg-[#111827] p-7 text-white shadow-xl shadow-black/10 sm:p-8">
            <p className="text-sm font-semibold text-[#b8ff39]">Estado del sistema</p>
            <h2 className="mt-3 text-2xl font-black">Base inicial activa</h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Next.js, TypeScript, Tailwind y PWA ya estan configurados. La proxima etapa conecta autenticacion y Google Sheets.
            </p>
            <div className="mt-8 space-y-3">
              {["Interfaz responsive", "Instalable como PWA", "Estructura multiempresa", "Lista para Vercel"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/75">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#b8ff39]" />
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
