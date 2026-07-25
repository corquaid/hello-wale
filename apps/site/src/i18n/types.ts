export interface Benefit {
	icon: string;
	title: string;
	description: string;
}

export interface AntiSeasonalityBlock {
	title: string;
	description: string;
}

export interface Step {
	number: string;
	title: string;
	description: string;
}

export interface UseCaseItem {
	company: string;
	badge: string;
	description: string;
	outcome: string;
	imageAlt: string;
	reverse: boolean;
}

export interface Stat {
	value: string;
	description: string;
	source: string;
}

export interface ScienceCard {
	title: string;
	description: string;
	alt: string;
}

export interface Pillar {
	heading: string;
	body: string;
	cta: string;
}

export interface HeroCopy {
	beforeText: string;
	bubbleText: string;
	afterText: string;
	subtext: string;
}

export interface HowItWorksCopy {
	eyebrow: string;
	headline: string;
	subtext: string;
	steps: Step[];
	ctaLabel: string;
}

export interface ForHostsCopy {
	eyebrow: string;
	headline: string;
	paragraph: string;
	benefits: Benefit[];
	ctaLabel: string;
}

export interface EmailCaptureCopy {
	eyebrow: string;
	headline: string;
	subtext: string;
	placeholder: string;
	emailAriaLabel: string;
	submitAriaLabel: string;
	successMessage: string;
}

export interface Dictionary {
	nav: {
		forCompanies: string;
		forHosts: string;
		forProfessionals: string;
		story: string;
		blog: string;
		faq: string;
		partnerWithUs: string;
	};
	common: {
		footerRights: string;
		footer: {
			tagline: string;
			exploreHeading: string;
			resourcesHeading: string;
			contactHeading: string;
			contactLabel: string;
		};
		forCompanies: {
			eyebrow: string;
			headline: string;
			subtext: string;
			imageAlt: string;
			benefits: string[];
			ctaLabel: string;
		};
		whyWellbeing: {
			eyebrow: string;
			headline: string;
			subtext: string;
			stats: Stat[];
			sourceLabel: string;
		};
		scienceOfChange: {
			eyebrow: string;
			headline: string;
			subtext: string;
			cards: ScienceCard[];
		};
		useCases: {
			eyebrow: string;
			headline: string;
			subtext: string;
		};
	};
	homePage: {
		meta: {
			title: string;
			description: string;
		};
		hero: HeroCopy & { ctaGhost: string; ctaCream: string };
		whatWeDo: {
			eyebrow: string;
			headlineBefore: string;
			headlineAfter: string;
			headlineLine2: string;
			pillars: Pillar[];
		};
		useCases: {
			items: UseCaseItem[];
		};
		antiSeasonality: {
			eyebrow: string;
			block: AntiSeasonalityBlock;
			ctaLabel: string;
		};
		forHosts: ForHostsCopy;
		howItWorks: HowItWorksCopy;
		emailCapture: EmailCaptureCopy;
	};
	companiesPage: {
		meta: {
			title: string;
			description: string;
		};
		hero: HeroCopy & { ctaMaroon: string; ctaPeach: string };
		howItWorks: HowItWorksCopy;
		biggerPicture: string;
		useCases: {
			items: UseCaseItem[];
		};
	};
	hostsPage: {
		meta: {
			title: string;
			description: string;
		};
		hero: HeroCopy & { ctaPartner: string; ctaListing: string };
		forHosts: ForHostsCopy;
		biggerPicture: string;
		antiSeasonality: {
			blocks: AntiSeasonalityBlock[];
		};
		howItWorks: HowItWorksCopy;
	};
	professionalsPage: {
		meta: {
			title: string;
			description: string;
		};
		hero: HeroCopy;
		emailCapture: EmailCaptureCopy;
	};
}
