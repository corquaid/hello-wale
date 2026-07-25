import type { Dictionary } from "./types";

const howItWorksSteps = [
	{
		number: "01",
		title: "You reach out",
		description: "Through this site, or by email. We respond within 48 hours.",
	},
	{
		number: "02",
		title: "We learn about you",
		description: "A short call to understand your team's needs or your property's offering.",
	},
	{
		number: "03",
		title: "The partnership",
		description: "Subscription tier, booking rates, founding benefits tailored to fit.",
	},
	{
		number: "04",
		title: "You're in. Forever.",
		description: "Founding partners stay founding partners. Locked-in pricing, lifetime.",
	},
];

const forHostsBenefits = [
	{
		icon: "💸",
		title: "0% rates",
		description: "Rates at 0% for the first free months.",
	},
	{
		icon: "🤝",
		title: "Co-create the platform with us",
		description: "Your feedback shapes the product.",
	},
	{
		icon: "⭐",
		title: "Featured listing everyone sees",
		description: "On our homepage, in our launch press.",
	},
];

export const en: Dictionary = {
	nav: {
		forCompanies: "For Companies",
		forHosts: "For Hosts",
		forProfessionals: "For Professionals",
		story: "HelloWale Story",
		blog: "Blog",
		faq: "FAQ",
		partnerWithUs: "Partner with us",
	},
	common: {
		footerRights: "All rights reserved.",
		footer: {
			tagline: "The platform for remote work stays — built for companies, hosts, and remote professionals.",
			exploreHeading: "Explore",
			resourcesHeading: "Resources",
			contactHeading: "Get in touch",
			contactLabel: "Contact us",
		},
		forCompanies: {
			eyebrow: "For Companies",
			headline: "The wellbeing benefit\nyour team will actually use.",
			subtext:
				"Workation isn't a perk anymore — it's how the best teams stay sharp, creative, and retained. HelloWale makes it simple to offer.",
			imageAlt:
				"A hotel-style door hanger reading 'Where work doesn't feel like work anymore' on a dark wood door surrounded by jungle greenery",
			benefits: ["Lower cost than you think", "Employer branding", "Higher creativity", "Better retention"],
			ctaLabel: "Partner your company",
		},
		whyWellbeing: {
			eyebrow: "Why wellbeing matters",
			headline: "The numbers behind better work.",
			subtext: "Wellbeing makes the difference between teams that ship and teams that burn out.",
			stats: [
				{
					value: "77%",
					description: "of employees experience burnout at their current job",
					source: "Deloitte",
				},
				{
					value: "+13%",
					description: "productivity gain in teams with strong wellbeing programmes",
					source: "Oxford University",
				},
				{
					value: "3.3×",
					description: "more likely to feel engaged when given workation flexibility",
					source: "Gallup",
				},
			],
			sourceLabel: "Source:",
		},
		scienceOfChange: {
			eyebrow: "The science of change",
			headline: "Where you work\nchanges how you think.",
			subtext:
				"It's not romance — it's neuroscience. Environment is one of the strongest predictors of creative output, focus, and recovery. And it's the easiest thing to change.",
			cards: [
				{
					title: "Where focus deepens",
					description:
						"Same desk, same view, same thinking — the brain filters familiar surroundings, including the ideas that come from them.",
					alt: "A person wearing headphones focused on a laptop by a window",
				},
				{
					title: "Where ideas connect",
					description:
						"Why the best ideas come on holiday and rarely back at the desk. Novel environments activate the brain's default mode — the source of insight.",
					alt: "Two colleagues high-fiving in a bright office",
				},
				{
					title: "Where energy returns",
					description:
						"Why a week away often beats a month at the desk. Nature and new spaces reset cognitive capacity faster than time off alone.",
					alt: "A couple collaborating together, one wearing glasses, in a bright warm space",
				},
			],
		},
		useCases: {
			eyebrow: "Real teams. Real workations.",
			headline: "Built for teams of every size.",
			subtext: "Three approaches to workation. One platform that makes it work.",
		},
	},
	homePage: {
		meta: {
			title: "Home",
			description: "HelloWale — the platform for remote work stays.",
		},
		hero: {
			beforeText: "Your",
			bubbleText: "office,",
			afterText: "reimagined.",
			subtext:
				"We're building the platform for remote work stays. Not just a place to sleep — a place where things actually happen. Be one of the first.",
			ctaGhost: "Partner with us",
			ctaCream: "Start Listing — It's Free",
		},
		whatWeDo: {
			eyebrow: "Connecting people and places that work",
			headlineBefore: "Burned-out teams.",
			headlineAfter: "Empty winter calendars.",
			headlineLine2: "We're connecting the two.",
			pillars: [
				{
					heading: "Companies struggling with retention",
					body: "Help your team break routine, boost wellbeing, and build a culture people stay for.",
					cta: "Partner your company",
				},
				{
					heading: "Hosts facing seasonality",
					body: "Help your team break routine, boost wellbeing, and build a culture people stay for.",
					cta: "List your property",
				},
				{
					heading: "Remote professionals tired of working alone",
					body: "Help your team break routine, boost wellbeing, and build a culture people stay for.",
					cta: "Get early access",
				},
			],
		},
		useCases: {
			items: [
				{
					company: "Marketing agency",
					badge: "25 employees",
					description: "Quarterly team workations to reset and brainstorm next campaigns.",
					outcome: "Three campaigns. One villa in Tuscany. Zero meeting fatigue.",
					imageAlt: "Two colleagues from a marketing agency looking at a laptop together outdoors",
					reverse: false,
				},
				{
					company: "Tech scale-up",
					badge: "25 employees",
					description:
						"Each team member gets 2 workation weeks per year as part of their wellbeing package.",
					outcome: "A retention story we tell at every job interview.",
					imageAlt: "A tech team collaborating around a table with coffee and notes",
					reverse: true,
				},
			],
		},
		antiSeasonality: {
			eyebrow: "The problem with tourism",
			block: {
				title: "Tourism is seasonal. Work isn't.",
				description:
					"Hosts see 80% of bookings in just 4 months. The other 8? Empty calendars. HelloWale fills the gap with companies sending teams on workation year-round.",
			},
			ctaLabel: "List your property",
		},
		forHosts: {
			eyebrow: "For hosts",
			headline: "Be one of the first\nhosts in Poland.",
			paragraph:
				"We're partnering with a small group of founding hosts to shape what HelloWale becomes. Get in early, help us design it, and earn exclusive launch benefits for life.",
			benefits: forHostsBenefits,
			ctaLabel: "List your property - it's free",
		},
		howItWorks: {
			eyebrow: "How it works",
			headline: "From conversation to workation.",
			subtext:
				"HelloWale is launching in 2026. Here's how partnership works right now — before the platform is live.",
			steps: howItWorksSteps,
			ctaLabel: "Let's Talk",
		},
		emailCapture: {
			eyebrow: "For remote workers & freelancers",
			headline: "Solo traveler? Be the first to know",
			subtext:
				"Workation isn't just for companies. If you're a freelancer or remote worker, leave your email and we'll let you know the moment HelloWale opens to individuals.",
			placeholder: "Enter your email address",
			emailAriaLabel: "Email address",
			submitAriaLabel: "Submit",
			successMessage: "Thanks — we'll be in touch when it's your turn.",
		},
	},
	companiesPage: {
		meta: {
			title: "For Companies",
			description: "Give your team a wellbeing benefit they'll actually use — workation partnerships with HelloWale.",
		},
		hero: {
			beforeText: "Out of",
			bubbleText: "office,",
			afterText: "not out of ambition",
			subtext: "Built for companies, hosts, and remote professionals",
			ctaMaroon: "Start a workation",
			ctaPeach: "Start hosting",
		},
		howItWorks: {
			eyebrow: "How it works",
			headline: "Become a founding partner",
			subtext:
				"HelloWale is launching later in 2026. Here's how partnership works right now before the platform is open to everyone.",
			steps: howItWorksSteps,
			ctaLabel: "Let's Talk",
		},
		biggerPicture: "The bigger picture",
		useCases: {
			items: [
				{
					company: "Marketing agency",
					badge: "25 employees",
					description: "Quarterly team workations to reset and brainstorm next campaigns.",
					outcome: "Three campaigns. One villa in Tuscany. Zero meeting fatigue.",
					imageAlt: "Two colleagues from a marketing agency looking at a laptop together outdoors",
					reverse: false,
				},
				{
					company: "Tech scale-up",
					badge: "100 + employees",
					description:
						"Each team member gets 2 workation weeks per year as part of their wellbeing package.",
					outcome: "A retention story we tell at every job interview.",
					imageAlt: "A tech team collaborating around a table with coffee and notes",
					reverse: true,
				},
			],
		},
	},
	hostsPage: {
		meta: {
			title: "For Hosts",
			description: "Open your doors to a growing community — become a founding HelloWale host.",
		},
		hero: {
			beforeText: "Open",
			bubbleText: "your doors",
			afterText: "to a growing community",
			subtext:
				"Host companies and remote professionals combining work and travel, creating new opportunities for your business.",
			ctaPartner: "Partner with us",
			ctaListing: "Start Listing — It's Free",
		},
		forHosts: {
			eyebrow: "For hosts",
			headline: "Be one of the first hosts in Poland.",
			paragraph:
				"We're partnering with a small group of founding hosts to shape what HelloWale becomes. Get in early, help us design it, and earn exclusive launch benefits for life.",
			benefits: forHostsBenefits,
			ctaLabel: "Let's Talk",
		},
		biggerPicture: "The bigger picture",
		antiSeasonality: {
			blocks: [
				{
					title: "Tourism is seasonal. Work isn't.",
					description:
						"Most hosts see 80% of bookings in just 4 months. The rest of the year? Empty calendars. HelloWale fills the gap with companies sending teams on workations year-round.",
				},
				{
					title: "The kind of guests you hope for",
					description:
						"They stay a little longer, treat your space with care, and are happy to recommend it to others. The result? More predictable income, fewer turnovers, and better reviews.",
				},
				{
					title: "Why workation is a thing",
					description:
						"The best ideas don't always happen in meeting rooms. Workations bring teams together to collaborate, recharge, and reconnect, helping build stronger cultures and happier employees.",
				},
			],
		},
		howItWorks: {
			eyebrow: "How it works",
			headline: "Become a founding partner",
			subtext:
				"HelloWale is launching later in 2026. Here's how partnership works right now before the platform is open to everyone.",
			steps: howItWorksSteps,
			ctaLabel: "Let's Talk",
		},
	},
	professionalsPage: {
		meta: {
			title: "For Remote Professionals",
			description: "Remote doesn't have to mean alone — find places that work for the way you work.",
		},
		hero: {
			beforeText: "",
			bubbleText: "Remote",
			afterText: "doesn't have to mean alone",
			subtext:
				"Find places that work for the way you work and connect with like-minded professionals wherever you go.",
		},
		emailCapture: {
			eyebrow: "For remote workers & freelancers",
			headline: "Solo traveler? Be the first to know.",
			subtext:
				"The best opportunities come from the people you meet. And that goes for everything from friendships to professional networks. Leave your email and we'll let you know the moment HelloWale opens to individuals who believe workations are better when shared with others.",
			placeholder: "Enter your email address",
			emailAriaLabel: "Email address",
			submitAriaLabel: "Submit",
			successMessage: "Thanks — we'll be in touch when it's your turn.",
		},
	},
};
