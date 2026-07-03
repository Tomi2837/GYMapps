import type { GymSetup } from "./types";

export function StepGym({ value, onChange }: { value: GymSetup; onChange: (value: GymSetup) => void }) {
  return (
    <div>
      <span className="inline-flex rounded-full bg-[#b8ff39]/30 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#33430d]">
        Datos del negocio
      </span>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Contanos sobre el gimnasio</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">
        Estos datos se utilizaran en el panel, el acceso de socios y los comprobantes.
      </p>

      <div className="mt-9 grid max-w-3xl gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-bold text-gray-700">Nombre del gimnasio</span>
          <input
            value={value.name}
            onChange={(event) => onChange({ ...value, name: event.target.value })}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#111827] focus:bg-white"
            placeholder="Ej. Black House Gym"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-bold text-gray-700">Direccion</span>
          <input
            value={value.address}
            onChange={(event) => onChange({ ...value, address: event.target.value })}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#111827] focus:bg-white"
            placeholder="Calle, numero, localidad y provincia"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-gray-700">Telefono</span>
          <input
            value={value.phone}
            onChange={(event) => onChange({ ...value, phone: event.target.value })}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-[#111827] focus:bg-white"
            placeholder="11 0000 0000"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-gray-700">Logo del gimnasio</span>
          <span className="flex h-14 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 text-sm font-bold text-gray-500">
            Cargar logo
            <input type="file" accept="image/*" className="hidden" />
          </span>
        </label>
      </div>
    </div>
  );
}
