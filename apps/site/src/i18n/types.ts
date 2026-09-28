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

export interface FooterLinkColumn {
	heading: string;
	links: string[];
}

export interface FooterCtaCard {
	title: string;
	description: string;
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

export interface BookingsChartCopy {
	statCaption: string;
	title: string;
	monthInitials: string[];
	peakLegend: string;
	offSeasonLegend: string;
}

export interface PageMeta {
	title: string;
	description: string;
}

export interface SentModalCopy {
	title: string;
	body: string;
	closeLabel: string;
	secondaryLabel: string;
}

// Messages shown under a field when validation fails. `{min}`, `{max}` and
// `{digits}` are filled in from the limits in formValidation.ts.
export interface FormValidationCopy {
	lettersOnly: string;
	tooShort: string;
	tooLong: string;
	emailChars: string;
	emailInvalid: string;
	digitsOnly: string;
	tooManyDigits: string;
	phoneDigits: string;
	phoneDigitsRange: string;
	freeTextChars: string;
	urlInvalid: string;
	consentRequired: string;
}

// Strings every form shares. Each form's copy extends this, so a form island
// takes a single `copy` prop.
export interface FormSharedCopy {
	phoneNumber: string;
	phoneCodeAriaLabel: string;
	consentBefore: string;
	consentLink: string;
	consentAfter: string;
	sending: string;
	closeAriaLabel: string;
	validation: FormValidationCopy;
}

export interface FieldCopy {
	label: string;
	placeholder: string;
}

// Keys map to the fixed values HubSpot stores (see HostApplicationForm.tsx),
// so only the labels here are translated.
export type PropertyTypeKey = "apartment" | "house" | "cabin" | "studio" | "other";
export type WorkReadyKey = "wifi" | "desk" | "quiet" | "kitchen" | "nature" | "coffee";
export type AvailabilityKey = "yearRound" | "offSeason" | "specificMonths";
export type PartnerIntentKey = "wellbeing" | "retreats" | "individual" | "curious";

export interface HostApplicationFormCopy extends FormSharedCopy {
	sections: {
		aboutYou: string;
		aboutSpace: string;
		workReady: string;
		workReadySubtext: string;
		availability: string;
		listedElsewhere: string;
		listedElsewhereSubtext: string;
		story: string;
		storySubtext: string;
	};
	fields: {
		fullName: FieldCopy;
		email: FieldCopy;
		propertyName: FieldCopy;
		city: FieldCopy;
		country: FieldCopy;
		propertyType: FieldCopy;
		guestCapacity: FieldCopy;
		bedrooms: FieldCopy;
		workReadyOther: FieldCopy;
		airbnbUrl: string;
		bookingUrl: string;
		months: string;
		storyPlaceholder: string;
	};
	propertyTypes: Record<PropertyTypeKey, string>;
	bedroomStudio: string;
	workReadyOptions: Record<WorkReadyKey, string>;
	availabilityOptions: Record<AvailabilityKey, string>;
	monthNames: string[];
	required: {
		fullName: string;
		email: string;
		propertyName: string;
		city: string;
		country: string;
		propertyType: string;
		guestCapacity: string;
		bedrooms: string;
	};
	error: string;
	submit: string;
	footnote: string;
	modal: SentModalCopy;
}

export interface PartnerEnquiryFormCopy extends FormSharedCopy {
	sections: {
		aboutYou: string;
		aboutCompany: string;
		intents: string;
		intentsSubtext: string;
		message: string;
		messageSubtext: string;
	};
	fields: {
		fullName: FieldCopy;
		workEmail: FieldCopy;
		jobTitle: FieldCopy;
		companyName: FieldCopy;
		teamSize: FieldCopy;
		country: FieldCopy;
		messagePlaceholder: string;
	};
	intents: Record<PartnerIntentKey, { title: string; description: string }>;
	required: {
		fullName: string;
		workEmail: string;
		phone: string;
		companyName: string;
		teamSize: string;
		country: string;
		intents: string;
	};
	error: string;
	submit: string;
	footnote: string;
	modal: SentModalCopy;
}

export interface ContactFormCopy {
	name: string;
	email: string;
	message: string;
	error: string;
	sending: string;
	submit: string;
	successTitle: string;
	successBody: string;
	validation: FormValidationCopy;
	required: {
		name: string;
		email: string;
		message: string;
	};
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
		footer: {
			backToTop: string;
			columns: {
				companies: FooterLinkColumn;
				hosts: FooterLinkColumn;
				company: FooterLinkColumn;
				legal: FooterLinkColumn;
			};
			ctaCards: {
				companies: FooterCtaCard;
				hosts: FooterCtaCard;
				guests: FooterCtaCard;
			};
			copyright: string;
			designedByPrefix: string;
			designedByName: string;
			euFundingNotice: string;
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
		bookingsChart: BookingsChartCopy;
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
		hero: HeroCopy & { ctaMaroon: string };
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
		hero: HeroCopy & { ctaListing: string };
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
	becomeAHostPage: {
		meta: PageMeta;
		headline: string;
		intro: string;
		benefitsHeading: string;
		// Rendered alongside a fixed list of four icons, in this order:
		// zero rates, featured, co-create, lower fees.
		benefits: { title: string; description: string }[];
		footnote: string;
		formTitle: string;
		formSubtext: string;
		form: HostApplicationFormCopy;
	};
	partnerWithUsPage: {
		meta: PageMeta;
		headline: string;
		intro: string;
		benefitsHeading: string;
		benefits: string[];
		formTitle: string;
		formSubtext: string;
		form: PartnerEnquiryFormCopy;
	};
	contactPage: {
		meta: PageMeta;
		headline: string;
		subtext: string;
		form: ContactFormCopy;
	};
}
