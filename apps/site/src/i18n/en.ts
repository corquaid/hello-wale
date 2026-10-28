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
		icon: "zero-rates",
		title: "0% rates",
		description: "Rates at 0% for the first free months.",
	},
	{
		icon: "co-create",
		title: "Co-create the platform with us",
		description: "Your feedback shapes the product.",
	},
	{
		icon: "featured",
		title: "Featured listing everyone sees",
		description: "On our homepage, in our launch press.",
	},
];

const validation = {
	lettersOnly: "Use letters only",
	tooShort: "Enter at least {min} characters",
	tooLong: "Enter no more than {max} characters",
	emailChars: "Use only letters, numbers and @ - _ .",
	emailInvalid: "Enter a valid email address",
	digitsOnly: "Use numbers only",
	tooManyDigits: "Enter no more than {max} digits",
	phoneDigits: "Enter {digits} digits",
	phoneDigitsRange: "Enter between {min} and {max} digits",
	freeTextChars: "Remove special characters such as < > { } [ ]",
	urlInvalid: "Enter a valid link, starting with https://",
	consentRequired: "Tick the box to agree",
};

const formShared = {
	phoneNumber: "Phone Number",
	phoneCodeAriaLabel: "Country calling code",
	consentBefore: "I've read and agree to the ",
	consentLink: "Privacy Policy",
	consentAfter: ".",
	sending: "Sending…",
	closeAriaLabel: "Close",
	validation,
};

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
		footer: {
			backToTop: "Back to top",
			columns: {
				companies: {
					heading: "For Companies",
					links: ["Learn about workation", "Partner with us", "Pricing", "Case studies"],
				},
				hosts: {
					heading: "For Hosts",
					links: ["Become a host", "Founding host benefits", "Host resources"],
				},
				company: {
					heading: "Company",
					links: ["HelloWale Story", "Blog", "Contact us"],
				},
				legal: {
					heading: "Legal",
					links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
				},
			},
			ctaCards: {
				companies: {
					title: "For Companies",
					description: "Complete workation benefits for your team",
				},
				hosts: {
					title: "For Hosts",
					description: "Simple year-round hosting management",
				},
				guests: {
					title: "For Guests",
					description: "Discover work-ready stays around the world",
				},
			},
			copyright: "© HelloWale {year} · All rights reserved.",
			designedByPrefix: "Designed by ",
			designedByName: "GreenAgency",
			euFundingNotice: "With the contribution of the EISMEA Programme of the European Union",
		},
		forCompanies: {
			eyebrow: "For Companies",
			headline: "The wellbeing benefit\nyour team will actually use.",
			subtext:
				"Workation isn't a perk anymore — it's how the best teams stay sharp, creative, and retained. HelloWale makes it simple to offer.",
			imageAlt:
				"A hotel-style door hanger reading 'Where work doesn't feel like work anymore' on a dark wood door surrounded by jungle greenery",
			benefits: [
				"Lower cost than you think",
				"Employer branding",
				"Higher creativity",
				"Better retention",
			],
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
					alt: "A cozy home desk setup with a laptop stand, monitor, and olive plant by a sunlit window",
				},
				{
					title: "Where ideas connect",
					description:
						"Why the best ideas come on holiday and rarely back at the desk. Novel environments activate the brain's default mode — the source of insight.",
					alt: "A man working at a standing desk with a beach and ocean visible through the window",
				},
				{
					title: "Where energy returns",
					description:
						"Why a week away often beats a month at the desk. Nature and new spaces reset cognitive capacity faster than time off alone.",
					alt: "A man breathing in the fresh air on a lakeside dock surrounded by mountains",
				},
			],
		},
		useCases: {
			eyebrow: "Real teams. Real workations.",
			headline: "Built for teams of every size.",
			subtext: "Three approaches to workation. One platform that makes it work.",
		},
		bookingsChart: {
			statCaption: "of bookings happen in just 4 months of the year.",
			title: "Bookings by month (typical Airbnb host)",
			monthInitials: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
			peakLegend: "Peak season (May–Aug)",
			offSeasonLegend: "Off-season — empty calendar",
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
					heading: "Where empty months fill up",
					body: "Bring in professional remote guests when tourists don't. Longer stays, steadier income, year-round bookings.",
					cta: "List your property",
				},
				{
					heading: "For anyone whose desk stopped inspiring them.",
					body: "Solo or small groups. A few days or a full month. Find stays that give you what your desk can't.",
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
					outcome: "Three campaigns. One villa. Zero meeting fatigue.",
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
			description:
				"Give your team a wellbeing benefit they'll actually use — workation partnerships with HelloWale.",
		},
		hero: {
			beforeText: "Out of",
			bubbleText: "office,",
			afterText: "not out of ambition",
			subtext: "Built for companies, hosts, and remote professionals",
			ctaMaroon: "Start a workation",
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
			description:
				"Remote doesn't have to mean alone — find places that work for the way you work.",
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
	becomeAHostPage: {
		meta: {
			title: "Become a host",
			description:
				"Be one of the first hosts in Poland — apply to become a founding HelloWale host.",
		},
		headline: "Be one of the first hosts in Poland.",
		intro:
			"We're onboarding founding hosts personally, small group, big benefits. Share your details and we'll get back within a few days.",
		benefitsHeading: "✳ FOUNDING HOST BENEFITS",
		benefits: [
			{ title: "0% rates", description: "Rates at 0% for the first free months." },
			{
				title: "Featured listing everyone sees",
				description: "On our homepage, in our launch press.",
			},
			{ title: "Co-create the platform with us", description: "Your feedback shapes the product." },
			{
				title: "Lower lifetime fees for founding hosts",
				description: "Locked in for as long as you host with us.",
			},
		],
		footnote: "✳ Listing is free. We respond within 48 hours.",
		formTitle: "Founding host application",
		formSubtext: "Takes about 4 minutes. Fields with * are required.",
		form: {
			...formShared,
			sections: {
				aboutYou: "About you",
				aboutSpace: "About your space",
				workReady: "Is it work-ready?",
				workReadySubtext: "Check all that apply — this helps us understand fit.",
				availability: "When is it available?",
				listedElsewhere: "Currently listed elsewhere?",
				listedElsewhereSubtext: "Optional — helps us understand your setup.",
				story: "What makes your space special?",
				storySubtext: "Optional but it's your chance to tell your story.",
			},
			fields: {
				fullName: { label: "Full name", placeholder: "e.g. Elena Novak" },
				email: { label: "Email", placeholder: "you@company.com" },
				propertyName: {
					label: "Property name",
					placeholder: "e.g. Casa Amelia, Mountain Cabin, Studio 42",
				},
				city: { label: "City", placeholder: "e.g. Zakopane" },
				country: { label: "Country", placeholder: "e.g. Poland" },
				propertyType: { label: "Property type", placeholder: "Choose type" },
				guestCapacity: { label: "Fits how many guests?", placeholder: "Choose capacity" },
				bedrooms: { label: "Bedrooms", placeholder: "Choose" },
				workReadyOther: {
					label: "Anything else? (optional)",
					placeholder: "e.g. Standing desk, outdoor covered workspace, second monitor available",
				},
				airbnbUrl: "Airbnb URL",
				bookingUrl: "Booking.com URL",
				months: "Which months? Select all that apply.",
				storyPlaceholder:
					"Share what makes your property unique — the view, the community, the vibe, the history, why remote workers would love it here...",
			},
			propertyTypes: {
				apartment: "Apartment",
				house: "House / Villa",
				cabin: "Cabin / Cottage",
				studio: "Studio",
				other: "Other",
			},
			bedroomStudio: "Studio",
			workReadyOptions: {
				wifi: "Fast Wi-Fi (100+ Mbps)",
				desk: "Dedicated desk / workspace",
				quiet: "Quiet during working hours",
				kitchen: "Full kitchen",
				nature: "Nature / outdoor access",
				coffee: "Coffee, tea, water included",
			},
			availabilityOptions: {
				yearRound: "Year-round",
				offSeason: "Mostly off-season (Oct—Apr)",
				specificMonths: "Specific months only",
			},
			monthNames: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			],
			required: {
				fullName: "Enter your full name",
				email: "Enter your email",
				propertyName: "Enter your property's name",
				city: "Enter the city",
				country: "Enter the country",
				propertyType: "Choose a property type",
				guestCapacity: "Choose how many guests it fits",
				bedrooms: "Choose the number of bedrooms",
			},
			error:
				"Something went wrong sending your application. Please try again, or email us directly.",
			submit: "Apply as founding host",
			footnote: "Founding host applications are reviewed personally. Response within a few days.",
			modal: {
				title: "Your space is on our radar!",
				body: "Thanks for applying as a founding host. We'll reply within 48 hours — a real person will walk you through the next steps. A confirmation is already in your inbox.",
				closeLabel: "Done",
				secondaryLabel: "See what makes a great workation stay →",
			},
		},
	},
	partnerWithUsPage: {
		meta: {
			title: "Partner with us",
			description:
				"Let's build your team's workation programme together — partner with HelloWale as a founding company.",
		},
		headline: "Let's build your team's workation programme together.",
		intro:
			"We're partnering with forward-thinking companies to shape what workation-as-a-benefit looks like. Get in early and get founding conditions for life.",
		benefitsHeading: "FOUNDING HOST BENEFITS",
		benefits: [
			"Lowest subscription we'll ever offer locked in forever",
			"Half-price booking rates for your employees",
			"Co-create the platform with us",
			"Featured as a launch partner",
		],
		formTitle: "Partnership enquiry",
		formSubtext: "Fill in a few details — takes about 2 minutes.",
		form: {
			...formShared,
			sections: {
				aboutYou: "About you",
				aboutCompany: "About your company",
				intents: "What brings you here?",
				intentsSubtext: "Choose one or more.",
				message: "Anything else we should know?",
				messageSubtext: "Optional but helpful for our first call.",
			},
			fields: {
				fullName: { label: "Full name", placeholder: "e.g. Elena Novak" },
				workEmail: { label: "Work email", placeholder: "you@company.com" },
				jobTitle: { label: "Job title", placeholder: "e.g. Head of People, Founder, HR Manager" },
				companyName: { label: "Company name", placeholder: "e.g. Green Studio" },
				teamSize: { label: "Team size", placeholder: "Write number" },
				country: { label: "Country", placeholder: "e.g. Poland" },
				messagePlaceholder:
					"Tell us what you're hoping HelloWale can do for your team, any specific stays you have in mind, or questions you'd like answered...",
			},
			intents: {
				wellbeing: { title: "Wellbeing benefit", description: "For the whole team, year-round." },
				retreats: { title: "Team retreats", description: "Offsites, planning weeks, resets." },
				individual: { title: "Individual perk", description: "Workation as a personal benefit." },
				curious: { title: "Just curious", description: "Exploring — not sure yet." },
			},
			required: {
				fullName: "Enter your full name",
				workEmail: "Enter your work email",
				phone: "Enter your phone number",
				companyName: "Enter your company name",
				teamSize: "Enter your team size",
				country: "Enter your company's country",
				intents: "Choose at least one option",
			},
			error: "Something went wrong sending your enquiry. Please try again, or email us directly.",
			submit: "Partner with us",
			footnote: "We'll respond within 48 hours. No sales pressure promise.",
			modal: {
				title: "Application sent!",
				body: "Thank you! A real person from our team will reply within 48 hours. We've also sent a confirmation to your inbox.",
				closeLabel: "Thank you",
				secondaryLabel: "Read our blog while you wait →",
			},
		},
	},
	contactPage: {
		meta: {
			title: "Contact",
			description: "Get in touch.",
		},
		headline: "Contact us",
		subtext: "Have a question? Send us a message below.",
		form: {
			name: "Name",
			email: "Email",
			message: "Message",
			error: "Something went wrong sending your message. Please try again.",
			sending: "Sending…",
			submit: "Send message",
			successTitle: "Thanks for reaching out!",
			successBody: "We'll get back to you shortly.",
			validation,
			required: {
				name: "Enter your name",
				email: "Enter your email",
				message: "Enter a message",
			},
		},
	},
};
