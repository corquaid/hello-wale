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
			categories: z.array(z.enum(BLOG_TOPIC_SLUGS)).min(1),
		}),
});

export const collections = { blog };
