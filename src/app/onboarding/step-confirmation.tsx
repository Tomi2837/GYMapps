import type { AdminSetup, GymSetup, MachineSetup } from "./types";

export function StepConfirmation({
  admin,
  gym,
  activities,
  machines,
}: {
  admin: AdminSetup;
  gym: GymSetup;
  activities: string[];
  machines: MachineSetup[];
}) {
  const selectedMachines = machines.filter((machine) => machine.selected);

  return (
    <div>
      <span className="inline-flex rounded-full bg-[#b8ff39]/30 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#33430d]">
        Todo listo
      </span>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Revisa la configuracion</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">
        Al finalizar se creara el perfil administrador y la configuracion inicial del gimnasio.
      </p>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Administrador</p>
          <p className="mt-4 text-xl font-black text-[#111827]">{admin.name}</p>
          <p className="mt-1 text-sm text-gray-500">{admin.email}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Gimnasio</p>
          <p className="mt-4 text-xl font-black text-[#111827]">{gym.name}</p>
          <p className="mt-1 text-sm text-gray-500">{gym.address}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Actividades</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {activities.map((activity) => (
              <span key={activity} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">{activity}</span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-gray-200 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Equipamiento</p>
          <p className="mt-4 text-3xl font-black text-[#111827]">{selectedMachines.length}</p>
          <p className="mt-1 text-sm text-gray-500">maquinas seleccionadas</p>
        </div>
      </div>
    </div>
  );
}
