import Image from "next/image";
import { MachinePlaceholder } from "./machine-placeholder";
import type { MachineSetup } from "./types";

export function StepMachines({ value, onChange }: { value: MachineSetup[]; onChange: (value: MachineSetup[]) => void }) {
  function toggle(id: string) {
    onChange(value.map((machine) => machine.id === id ? { ...machine, selected: !machine.selected } : machine));
  }

  function loadImage(id: string, file?: File) {
    if (!file) return;
    const imagePreview = URL.createObjectURL(file);
    onChange(
      value.map((machine) =>
        machine.id === id
          ? { ...machine, selected: true, imagePreview, imageName: file.name }
          : machine,
      ),
    );
  }

  return (
    <div>
      <span className="inline-flex rounded-full bg-[#b8ff39]/30 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#33430d]">
        Equipamiento
      </span>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">Selecciona las maquinas</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-gray-500">
        Cada maquina tendra una imagen predeterminada sobre fondo blanco. El administrador puede reemplazarla por una foto real.
      </p>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {value.map((machine) => (
          <article
            key={machine.id}
            className={`overflow-hidden rounded-3xl border bg-white transition ${
              machine.selected ? "border-[#111827] shadow-lg shadow-black/10" : "border-gray-200"
            }`}
          >
            <button type="button" onClick={() => toggle(machine.id)} className="block w-full text-left">
              <div className="relative h-40 bg-white">
                {machine.imagePreview ? (
                  <Image src={machine.imagePreview} alt={machine.name} fill unoptimized className="object-contain p-3" />
                ) : (
                  <MachinePlaceholder name={machine.name} />
                )}
                <span className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl text-sm font-black shadow ${machine.selected ? "bg-[#b8ff39] text-[#111827]" : "bg-white text-gray-400"}`}>
                  {machine.selected ? "✓" : "+"}
                </span>
              </div>
              <div className="border-t border-gray-100 p-4">
                <p className="font-black text-[#111827]">{machine.name}</p>
                <p className="mt-1 text-xs font-semibold text-gray-400">{machine.category}</p>
              </div>
            </button>

            {machine.selected && (
              <label className="flex cursor-pointer items-center justify-center border-t border-gray-100 px-4 py-3 text-xs font-black text-gray-600 hover:bg-gray-50">
                {machine.imageName ? "Cambiar foto" : "Cargar foto propia"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => loadImage(machine.id, event.target.files?.[0])}
                />
              </label>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
