import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arman Ali – Graphic Designer Portfolio",
    short_name: "Arman Ali",
    description: "Graphic design portfolio of Arman Ali — logos, brand identity, print and signage.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F5F9",
    theme_color: "#2A2438",
    icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  };
}
