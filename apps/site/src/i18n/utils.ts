import { en } from "./en";
import { pl } from "./pl";
import type { Dictionary } from "./types";

export const locales = ["en", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en, pl };

export function useTranslations(locale: Locale): Dictionary {
	return dictionaries[locale];
}

// Page slugs (relative to the locale root, no leading slash; "" = home)
// that currently exist in every locale. Extend this list as more pages
// get translated — it determines whether the Nav language switcher swaps
// to the same page in the other locale, or falls back to that locale's home.
export const translatedRoutes = ["", "companies", "hosts", "professionals"];

export function getAlternateLocale(locale: Locale): Locale {
	return locale === "en" ? "pl" : "en";
}

export const localeMeta: Record<Locale, { flag: string; label: string }> = {
	en: { flag: "🇬🇧", label: "English" },
	pl: { flag: "🇵🇱", label: "Polski" },
};
