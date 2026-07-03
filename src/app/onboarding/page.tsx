export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-[#eef2f7] p-6">
      <section className="mx-auto max-w-5xl rounded-[32px] bg-white p-10 shadow-xl">
        <span className="rounded-full bg-[#b8ff39]/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
          Configuracion inicial
        </span>
        <h1 className="mt-5 text-4xl font-black text-[#111827]">
          Configura tu gimnasio
        </h1>
        <p className="mt-3 text-gray-500">
          Crea el administrador, personaliza los colores y selecciona las actividades y maquinas disponibles.
        </p>
      </section>
    </main>
  );
}
