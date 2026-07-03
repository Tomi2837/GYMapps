"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MACHINE_CATALOG, SETUP_STEPS } from "./data";
import { StepAdmin } from "./step-admin";
import { StepActivities } from "./step-activities";
import { StepBrand } from "./step-brand";
import { StepConfirmation } from "./step-confirmation";
import { StepGym } from "./step-gym";
import { StepMachines } from "./step-machines";
import type { AdminSetup, BrandSetup, GymSetup, MachineSetup } from "./types";

const INITIAL_ADMIN: AdminSetup = { name: "", email: "", password: "" };
const INITIAL_GYM: GymSetup = { name: "", address: "", phone: "" };
const INITIAL_BRAND: BrandSetup = { primary: "#b8ff39", secondary: "#111827", background: "#f5f7fb" };

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [admin, setAdmin] = useState(INITIAL_ADMIN);
  const [gym, setGym] = useState(INITIAL_GYM);
  const [brand, setBrand] = useState(INITIAL_BRAND);
  const [activities, setActivities] = useState<string[]>([]);
  const [machines, setMachines] = useState<MachineSetup[]>(
    MACHINE_CATALOG.map((machine) => ({ ...machine, selected: false })),
  );

  const selectedMachines = useMemo(() => machines.filter((machine) => machine.selected), [machines]);

  function validate() {
    if (step === 0 && (!admin.name.trim() || !admin.email.trim() || admin.password.length < 8)) {
      setError("Completa nombre, email y una contrasena de al menos 8 caracteres.");
      return false;
    }
    if (step === 1 && (!gym.name.trim() || !gym.address.trim())) {
      setError("Completa el nombre y la direccion del gimnasio.");
      return false;
    }
    if (step === 3 && activities.length === 0) {
      setError("Selecciona al menos una actividad.");
      return false;
    }
    setError("");
    return true;
  }

  function next() {
    if (!validate()) return;
    setStep((current) => Math.min(current + 1, SETUP_STEPS.length - 1));
  }

  function back() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function finish() {
    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin,
          gym,
          brand,
          activities,
          machines: selectedMachines.map((machine) => ({
            id: machine.id,
            name: machine.name,
            category: machine.category,
            imageName: machine.imageName ?? "",
            imageUrl: "",
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "No se pudo crear el gimnasio.");
        return;
      }

      router.push(data.redirectTo ?? "/dashboard");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2f7] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-[1500px] overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[320px_1fr]">
        <aside className="relative overflow-hidden bg-[#111827] p-7 text-white sm:p-9">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#b8ff39]/15 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#b8ff39] font-black text-[#111827]">G</div>
            <div>
              <p className="font-black">GYM Control</p>
              <p className="text-xs text-white/50">Configuracion inicial</p>
            </div>
          </div>

          <div className="relative mt-10 hidden space-y-2 lg:block">
            {SETUP_STEPS.map((title, index) => {
              const active = index === step;
              const completed = index < step;
              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => completed && setStep(index)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition ${active ? "bg-white/10" : "hover:bg-white/5"}`}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black ${active || completed ? "bg-[#b8ff39] text-[#111827]" : "border border-white/15 text-white/45"}`}>
                    {completed ? "✓" : index + 1}
                  </span>
                  <span className={active ? "font-bold text-white" : "font-bold text-white/60"}>{title}</span>
                </button>
              );
            })}
          </div>

          <div className="relative mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 lg:mt-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8ff39]">Vista previa</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl text-lg font-black" style={{ backgroundColor: brand.primary, color: brand.secondary }}>
                {gym.name.trim().charAt(0).toUpperCase() || "G"}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold">{gym.name || "Tu gimnasio"}</p>
                <p className="truncate text-xs text-white/45">{gym.address || "Direccion sin definir"}</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col p-5 sm:p-8 lg:p-12 xl:p-16">
          <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Paso {step + 1} de {SETUP_STEPS.length}</p>
              <p className="mt-1 font-black text-[#111827]">{SETUP_STEPS[step]}</p>
            </div>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-[#b8ff39] transition-all" style={{ width: `${((step + 1) / SETUP_STEPS.length) * 100}%` }} />
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
            {step === 0 && <StepAdmin value={admin} onChange={setAdmin} />}
            {step === 1 && <StepGym value={gym} onChange={setGym} />}
            {step === 2 && <StepBrand value={brand} gym={gym} onChange={setBrand} />}
            {step === 3 && <StepActivities value={activities} onChange={setActivities} />}
            {step === 4 && <StepMachines value={machines} onChange={setMachines} />}
            {step === 5 && <StepConfirmation admin={admin} gym={gym} activities={activities} machines={machines} />}

            {error && <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

            <div className="mt-auto flex flex-col-reverse gap-3 border-t border-gray-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={back} disabled={step === 0 || saving} className="h-13 rounded-2xl border border-gray-200 px-6 text-sm font-bold text-gray-600 disabled:cursor-not-allowed disabled:opacity-30">
                Atras
              </button>
              {step < SETUP_STEPS.length - 1 ? (
                <button type="button" onClick={next} className="h-13 rounded-2xl bg-[#111827] px-8 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-black">
                  Continuar
                </button>
              ) : (
                <button type="button" onClick={finish} disabled={saving} className="h-13 rounded-2xl bg-[#b8ff39] px-8 text-sm font-black text-[#111827] transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-wait disabled:opacity-60">
                  {saving ? "Creando gimnasio..." : "Crear gimnasio"}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
