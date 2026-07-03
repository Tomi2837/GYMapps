import { ACTIVITIES } from "./data";

export function StepActivities({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  function toggle(activity: string) {
    onChange(value.includes(activity) ? value.filter((item) => item !== activity) : [...value, activity]);
  }

  return (
    <div>
      <span className="inline-flex rounded-full bg-[#b8ff39]/30 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#33430d]">
        Servicios
      </span>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Que actividades ofrece?</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">
        Esto permitira filtrar ejercicios, rutinas y contenido para cada socio.
      </p>

      <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIVITIES.map((activity) => {
          const selected = value.includes(activity);
          return (
            <button
              key={activity}
              type="button"
              onClick={() => toggle(activity)}
              className={`flex min-h-16 items-center justify-between rounded-2xl border px-5 text-left text-sm font-bold transition ${
                selected
                  ? "border-[#111827] bg-[#111827] text-white shadow-lg"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{activity}</span>
              <span className={`grid h-7 w-7 place-items-center rounded-lg ${selected ? "bg-[#b8ff39] text-[#111827]" : "bg-gray-100 text-gray-400"}`}>
                {selected ? "✓" : "+"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
