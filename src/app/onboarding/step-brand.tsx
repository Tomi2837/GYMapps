import type { BrandSetup, GymSetup } from "./types";

const COLOR_FIELDS = [
  { key: "primary", label: "Color principal" },
  { key: "secondary", label: "Color secundario" },
  { key: "background", label: "Fondo" },
] as const;

export function StepBrand({ value, gym, onChange }: { value: BrandSetup; gym: GymSetup; onChange: (value: BrandSetup) => void }) {
  return (
    <div>
      <span className="inline-flex rounded-full bg-[#b8ff39]/30 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#33430d]">
        Personalizacion
      </span>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Elegi los colores</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">
        La aplicacion se adaptara a la identidad visual de cada gimnasio.
      </p>

      <div className="mt-9 grid gap-5 sm:grid-cols-3">
        {COLOR_FIELDS.map((field) => (
          <label key={field.key} className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <span className="block text-sm font-bold text-gray-700">{field.label}</span>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="color"
                value={value[field.key]}
                onChange={(event) => onChange({ ...value, [field.key]: event.target.value })}
                className="h-14 w-14 cursor-pointer rounded-xl border-0 bg-transparent"
              />
              <span className="font-mono text-sm font-bold text-gray-500">{value[field.key]}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-[28px] border border-black/5 p-7" style={{ backgroundColor: value.background }}>
        <div className="flex items-center gap-3">
          <div
            className="grid h-12 w-12 place-items-center rounded-2xl font-black"
            style={{ backgroundColor: value.primary, color: value.secondary }}
          >
            {gym.name.charAt(0).toUpperCase() || "G"}
          </div>
          <div>
            <p className="font-black" style={{ color: value.secondary }}>{gym.name || "Tu gimnasio"}</p>
            <p className="text-sm text-gray-500">Panel personalizado</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-8 rounded-2xl px-6 py-3 text-sm font-black"
          style={{ backgroundColor: value.secondary, color: value.primary }}
        >
          Boton principal
        </button>
      </div>
    </div>
  );
}
