import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GYM Control",
    short_name: "GYM Control",
    description: "Sistema de gestion integral para gimnasios",
    start_url: "/login",
    display: "standalone",
    background_color: "#f5f7fb",
    theme_color: "#111827",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
