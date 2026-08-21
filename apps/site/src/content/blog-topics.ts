import type { Locale } from "@/i18n/utils";

export interface BlogTopic {
	slug: string;
	label: string;
	labelPl: string;
}

export const BLOG_TOPICS: BlogTopic[] = [
	{ slug: "workation-travel", label: "Workation & Travel", labelPl: "Workation i podróże" },
	{ slug: "employee-wellbeing", label: "Employee Wellbeing", labelPl: "Dobrostan pracowników" },
	{ slug: "company-culture", label: "Company Culture", labelPl: "Kultura firmy" },
	{ slug: "remote-work-trends", label: "Remote Work Trends", labelPl: "Trendy pracy zdalnej" },
	{ slug: "product-news", label: "HelloWale Product News", labelPl: "Nowości HelloWale" },
	{ slug: "science-of-change", label: "Science of Change", labelPl: "Nauka o zmianie" },
	{ slug: "for-hosts", label: "For Hosts", labelPl: "Dla gospodarzy" },
];

export const BLOG_TOPIC_SLUGS = BLOG_TOPICS.map((topic) => topic.slug) as [string, ...string[]];

export function getTopicLabel(slug: string, lang: Locale = "en"): string {
	const topic = BLOG_TOPICS.find((topic) => topic.slug === slug);
	if (!topic) return slug;
	return lang === "pl" ? topic.labelPl : topic.label;
}
