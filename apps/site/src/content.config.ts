import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { BLOG_TOPIC_SLUGS } from "./content/blog-topics";

const blog = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			heroImage: image(),
			images: z.array(image()).max(6).optional(),
			categories: z.array(z.enum(BLOG_TOPIC_SLUGS)).min(1),
			lang: z.enum(["en", "pl"]).default("en"),
			translationKey: z.string().optional(),
		}),
});

export const collections = { blog };
