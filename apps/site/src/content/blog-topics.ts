export interface BlogTopic {
	slug: string;
	label: string;
}

export const BLOG_TOPICS: BlogTopic[] = [
	{ slug: "workation-travel", label: "Workation & Travel" },
	{ slug: "employee-wellbeing", label: "Employee Wellbeing" },
	{ slug: "company-culture", label: "Company Culture" },
	{ slug: "remote-work-trends", label: "Remote Work Trends" },
	{ slug: "product-news", label: "HelloWale Product News" },
	{ slug: "science-of-change", label: "Science of Change" },
	{ slug: "for-hosts", label: "For Hosts" },
];

export const BLOG_TOPIC_SLUGS = BLOG_TOPICS.map(topic => topic.slug) as [string, ...string[]];

export function getTopicLabel(slug: string): string {
	return BLOG_TOPICS.find(topic => topic.slug === slug)?.label ?? slug;
}
