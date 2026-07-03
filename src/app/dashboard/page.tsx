import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { getAuthenticatedUser } from "@/lib/auth-cookie";
import { getDashboardData } from "@/modules/dashboard/service";

export const dynamic = "force-dynamic";

const modules = [
  { title: "Socios", description: "Altas, bajas, planes y vencimientos", href: "/dashboard/socios" },
  { title: "Pagos", description: "Cobros, metodos e historial", href: "/dashboard/pagos" },
  { title: "Check-in", description: "Accesos y validacion de cuotas", href: "/dashboard/check-in" },
  { title: "Rutinas", description: "Asignacion y seguimiento", href: "/dashboard/rutinas" },
  { title: "Ejercicios", description: "Biblioteca por grupo muscular", href: "/dashboard/ejercicios" },
  { title: "Configuracion", description: "Sucursal, usuarios y permisos", href: "/dashboard/configuracion" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DashboardPage() {
  const session = await getAuthenticatedUser();
  if (!session) redirect("/login");

  const data = await getDashboardData(session.gymId);
  const metrics = [
    { label: "Socios activos", value: String(data.stats.activeMembers), detail: `${data.stats.newMembersThisMonth} nuevos este mes` },
    { label: "Ingresos hoy", value: String(data.stats.todayCheckins), detail: "Check-ins registrados" },
    { label: "Cuotas vencidas", value: String(data.stats.expiredMembers), detail: "Requieren seguimiento" },
    { label: "Recaudacion del dia", value: formatCurrency(data.stats.todayRevenue), detail: "Pagos registrados hoy" },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: data.gym.backgroundColor }}>
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-2xl font-black"
              style={{ backgroundColor: data.gym.secondaryColor, color: data.gym.primaryColor }}
            >
              {data.gym.name.charAt(0).toUpperCase() || "G"}
            </div>
            <div>
              <p className="font-black text-[#111827]">{data.gym.name}</p>
              <p className="text-xs text-gray-400">Panel administrativo · {session.name}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]"
              style={{ backgroundColor: `${data.gym.primaryColor}55`, color: data.gym.secondaryColor }}
            >
              Datos en tiempo real
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Resumen del gimnasio</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
              Controla socios, ingresos, cuotas y recaudacion desde un solo panel.
            </p>
          </div>
          <a
            href="/dashboard/socios/nuevo"
            className="flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-bold transition hover:brightness-95"
            style={{ backgroundColor: data.gym.secondaryColor, color: data.gym.primaryColor }}
          >
            Registrar nuevo socio
          </a>
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
            <div>
              <h2 className="text-2xl font-black text-[#111827]">Modulos principales</h2>
              <p className="mt-1 text-sm text-gray-400">Accede a cada area de gestion del gimnasio.</p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {modules.map((module) => (
                <a key={module.title} href={module.href} className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-black/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black text-[#111827]">{module.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-500">{module.description}</p>
                    </div>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-lg transition" style={{ color: data.gym.secondaryColor }}>→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <aside className="rounded-[30px] p-7 text-white shadow-xl shadow-black/10 sm:p-8" style={{ backgroundColor: data.gym.secondaryColor }}>
            <p className="text-sm font-semibold" style={{ color: data.gym.primaryColor }}>Estado del sistema</p>
            <h2 className="mt-3 text-2xl font-black">Sistema conectado</h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              El acceso, la sesion y los datos del dashboard ya se obtienen desde la base del gimnasio.
            </p>
            <div className="mt-8 space-y-3">
              {["Administrador autenticado", "Google Sheets conectado", "Datos aislados por gimnasio", "Sesion segura activa"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/75">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.gym.primaryColor }} />
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
