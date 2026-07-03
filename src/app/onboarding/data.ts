export const ACTIVITIES = [
  "Musculacion",
  "Entrenamiento funcional",
  "Cross training",
  "Spinning",
  "Cardio",
  "Yoga",
  "Pilates",
  "Boxeo",
  "Artes marciales",
  "Calistenia",
  "Running",
  "Rehabilitacion",
] as const;

export const MACHINE_CATALOG = [
  { id: "treadmill", name: "Cinta de correr", category: "Cardio" },
  { id: "bike", name: "Bicicleta fija", category: "Cardio" },
  { id: "elliptical", name: "Eliptico", category: "Cardio" },
  { id: "rowing", name: "Remo ergometrico", category: "Cardio" },
  { id: "leg-press", name: "Prensa de piernas", category: "Piernas" },
  { id: "leg-extension", name: "Extension de cuadriceps", category: "Piernas" },
  { id: "leg-curl", name: "Camilla de femorales", category: "Piernas" },
  { id: "hack-squat", name: "Hack squat", category: "Piernas" },
  { id: "smith", name: "Maquina Smith", category: "Peso libre" },
  { id: "power-rack", name: "Rack de sentadillas", category: "Peso libre" },
  { id: "lat-pulldown", name: "Dorsalera", category: "Espalda" },
  { id: "cable-crossover", name: "Polea cruzada", category: "Poleas" },
  { id: "chest-press", name: "Press de pecho", category: "Pecho" },
  { id: "seated-row", name: "Remo sentado", category: "Espalda" },
  { id: "shoulder-press", name: "Press de hombros", category: "Hombros" },
  { id: "adductor", name: "Aductores y abductores", category: "Piernas" },
  { id: "bench", name: "Banco regulable", category: "Peso libre" },
  { id: "dumbbells", name: "Mancuernas", category: "Peso libre" },
] as const;

export const SETUP_STEPS = [
  "Administrador",
  "Gimnasio",
  "Identidad",
  "Actividades",
  "Maquinas",
  "Confirmacion",
] as const;
