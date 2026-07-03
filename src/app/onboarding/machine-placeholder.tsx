export function MachinePlaceholder({ name }: { name: string }) {
  return (
    <div className="grid h-full w-full place-items-center bg-white">
      <svg viewBox="0 0 180 120" className="h-[76%] w-[76%]" aria-label={name}>
        <rect x="32" y="92" width="116" height="8" rx="4" fill="#d7dde7" />
        <rect x="48" y="28" width="8" height="68" rx="4" fill="#111827" />
        <rect x="124" y="28" width="8" height="68" rx="4" fill="#111827" />
        <rect x="48" y="28" width="84" height="8" rx="4" fill="#111827" />
        <rect x="68" y="62" width="44" height="10" rx="5" fill="#9ca3af" />
        <rect x="76" y="70" width="8" height="24" rx="4" fill="#6b7280" />
        <circle cx="52" cy="47" r="10" fill="#b8ff39" stroke="#111827" strokeWidth="4" />
        <circle cx="128" cy="47" r="10" fill="#b8ff39" stroke="#111827" strokeWidth="4" />
      </svg>
    </div>
  );
}
