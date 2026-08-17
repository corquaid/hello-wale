const WORDS_PER_MINUTE = 200;

export function getReadingTime(body: string | undefined): string {
	const wordCount = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
	return `${minutes} min read`;
}

export function formatPostDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
