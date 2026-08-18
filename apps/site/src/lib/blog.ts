import type { Locale } from "@/i18n/utils";

const WORDS_PER_MINUTE = 200;

export function getReadingTime(body: string | undefined, lang: Locale = "en"): string {
	const wordCount = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
	return lang === "pl" ? `${minutes} min czytania` : `${minutes} min read`;
}

export function formatPostDate(date: Date, lang: Locale = "en"): string {
	return date.toLocaleDateString(lang === "pl" ? "pl-PL" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
