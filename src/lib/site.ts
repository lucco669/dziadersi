export const site = {
  name: "DZIADER.SI",
  institute: "Instytut Badań nad Dziaderstwem",
  founded: 2026,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dziader.si",
  tagline: "Zbadaj się, zanim będzie za późno.",
  description:
    "Instytut Badań nad Dziaderstwem: Test Dziadersa z certyfikatem, Atlas Dziadersów, Słownik Dziaderski i Narodowy Indeks Dziaderstwa. Serwis satyryczny.",
} as const;
