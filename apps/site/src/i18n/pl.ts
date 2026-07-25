import type { Dictionary } from "./types";

// First-pass machine-assisted translation — needs a native/professional
// review pass before this locale ships to real users.

const howItWorksSteps = [
	{
		number: "01",
		title: "Odzywasz się do nas",
		description: "Poprzez tę stronę lub e-mail. Odpowiadamy w ciągu 48 godzin.",
	},
	{
		number: "02",
		title: "Poznajemy Cię",
		description: "Krótka rozmowa, by zrozumieć potrzeby Twojego zespołu lub ofertę Twojej nieruchomości.",
	},
	{
		number: "03",
		title: "Partnerstwo",
		description: "Poziom subskrypcji, stawki rezerwacji i korzyści founderskie dopasowane do Ciebie.",
	},
	{
		number: "04",
		title: "Jesteś z nami. Na zawsze.",
		description: "Partnerzy założyciele pozostają partnerami założycielami. Stała cena, dożywotnio.",
	},
];

const forHostsBenefits = [
	{
		icon: "💸",
		title: "0% stawki",
		description: "Stawki 0% przez pierwsze darmowe miesiące.",
	},
	{
		icon: "🤝",
		title: "Współtwórz platformę razem z nami",
		description: "Twoja opinia kształtuje produkt.",
	},
	{
		icon: "⭐",
		title: "Wyróżniona oferta widoczna dla wszystkich",
		description: "Na naszej stronie głównej i w materiałach promujących nasz start.",
	},
];

export const pl: Dictionary = {
	nav: {
		forCompanies: "Dla firm",
		forHosts: "Dla gospodarzy",
		forProfessionals: "Dla profesjonalistów",
		story: "Historia HelloWale",
		blog: "Blog",
		faq: "FAQ",
		partnerWithUs: "Zostań partnerem",
	},
	common: {
		footerRights: "Wszelkie prawa zastrzeżone.",
		footer: {
			tagline:
				"Platforma dla pobytów łączących pracę zdalną z podróżą — stworzona dla firm, gospodarzy i profesjonalistów zdalnych.",
			exploreHeading: "Poznaj",
			resourcesHeading: "Zasoby",
			contactHeading: "Skontaktuj się",
			contactLabel: "Skontaktuj się z nami",
		},
		forCompanies: {
			eyebrow: "Dla firm",
			headline: "Benefit wellbeingowy,\nz którego Twój zespół naprawdę skorzysta.",
			subtext:
				"Workation to już nie dodatek — to sposób, w jaki najlepsze zespoły utrzymują koncentrację, kreatywność i zaangażowanie. HelloWale sprawia, że łatwo go zaoferować.",
			imageAlt:
				"Zawieszka drzwiowa w stylu hotelowym z napisem „Gdzie praca nie przypomina już pracy” na ciemnych drewnianych drzwiach otoczonych zielenią dżungli",
			benefits: ["Niższy koszt, niż myślisz", "Employer branding", "Większa kreatywność", "Lepsza retencja"],
			ctaLabel: "Zostań partnerem firmowym",
		},
		whyWellbeing: {
			eyebrow: "Dlaczego wellbeing ma znaczenie",
			headline: "Liczby stojące za lepszą pracą.",
			subtext: "Wellbeing to różnica między zespołami, które się rozwijają, a tymi, które się wypalają.",
			stats: [
				{
					value: "77%",
					description: "pracowników doświadcza wypalenia zawodowego w obecnej pracy",
					source: "Deloitte",
				},
				{
					value: "+13%",
					description: "wzrost produktywności w zespołach z silnymi programami wellbeingowymi",
					source: "Oxford University",
				},
				{
					value: "3,3×",
					description: "większa szansa na zaangażowanie przy elastyczności typu workation",
					source: "Gallup",
				},
			],
			sourceLabel: "Źródło:",
		},
		scienceOfChange: {
			eyebrow: "Nauka o zmianie",
			headline: "Miejsce, w którym pracujesz,\nzmienia sposób, w jaki myślisz.",
			subtext:
				"To nie romantyzm — to neuronauka. Otoczenie to jeden z najsilniejszych czynników wpływających na kreatywność, koncentrację i regenerację. I najłatwiej je zmienić.",
			cards: [
				{
					title: "Tam, gdzie pogłębia się koncentracja",
					description:
						"To samo biurko, ten sam widok, te same myśli — mózg filtruje znajome otoczenie, w tym pomysły, które z niego płyną.",
					alt: "Osoba w słuchawkach skupiona na laptopie przy oknie",
				},
				{
					title: "Tam, gdzie rodzą się pomysły",
					description:
						"Dlaczego najlepsze pomysły przychodzą na wakacjach, a rzadko przy biurku. Nowe otoczenie aktywuje tryb domyślny mózgu — źródło wglądu.",
					alt: "Dwoje współpracowników przybijających piątkę w jasnym biurze",
				},
				{
					title: "Tam, gdzie wraca energia",
					description:
						"Dlaczego tydzień z dala od biurka daje więcej niż miesiąc urlopu przy nim. Natura i nowe przestrzenie szybciej regenerują zdolności poznawcze niż sam odpoczynek.",
					alt: "Para współpracująca razem, jedna osoba w okularach, w jasnej, ciepłej przestrzeni",
				},
			],
		},
		useCases: {
			eyebrow: "Prawdziwe zespoły. Prawdziwe workation.",
			headline: "Stworzone dla zespołów każdej wielkości.",
			subtext: "Trzy podejścia do workation. Jedna platforma, która to wszystko łączy.",
		},
	},
	homePage: {
		meta: {
			title: "Strona główna",
			description: "HelloWale — platforma dla pobytów łączących pracę zdalną z podróżą.",
		},
		hero: {
			beforeText: "Twoje",
			bubbleText: "biuro,",
			afterText: "na nowo wymyślone.",
			subtext:
				"Budujemy platformę dla pobytów łączących pracę zdalną z podróżą. To nie tylko miejsce do spania — to miejsce, gdzie naprawdę coś się dzieje. Bądź jednym z pierwszych.",
			ctaGhost: "Zostań partnerem",
			ctaCream: "Dodaj ofertę — za darmo",
		},
		whatWeDo: {
			eyebrow: "Łączymy ludzi i miejsca, które działają",
			headlineBefore: "Wypalone zespoły.",
			headlineAfter: "Puste zimowe kalendarze.",
			headlineLine2: "My łączymy jedno z drugim.",
			pillars: [
				{
					heading: "Firmy zmagające się z retencją",
					body: "Pomóż swojemu zespołowi przełamać rutynę, zwiększyć dobrostan i zbudować kulturę, dla której warto zostać.",
					cta: "Zostań partnerem firmowym",
				},
				{
					heading: "Gospodarze zmagający się z sezonowością",
					body: "Pomóż swojemu zespołowi przełamać rutynę, zwiększyć dobrostan i zbudować kulturę, dla której warto zostać.",
					cta: "Dodaj swoją nieruchomość",
				},
				{
					heading: "Specjaliści zdalni zmęczeni pracą w pojedynkę",
					body: "Pomóż swojemu zespołowi przełamać rutynę, zwiększyć dobrostan i zbudować kulturę, dla której warto zostać.",
					cta: "Uzyskaj wczesny dostęp",
				},
			],
		},
		useCases: {
			items: [
				{
					company: "Agencja marketingowa",
					badge: "25 pracowników",
					description: "Kwartalne workation zespołowe na reset i burzę mózgów przed kolejnymi kampaniami.",
					outcome: "Trzy kampanie. Jedna willa w Toskanii. Zero zmęczenia spotkaniami.",
					imageAlt: "Dwoje współpracowników z agencji marketingowej patrzących razem na laptopa na zewnątrz",
					reverse: false,
				},
				{
					company: "Scale-up technologiczny",
					badge: "25 pracowników",
					description:
						"Każdy członek zespołu otrzymuje 2 tygodnie workation rocznie w ramach pakietu wellbeingowego.",
					outcome: "Historia retencji, którą opowiadamy na każdej rozmowie rekrutacyjnej.",
					imageAlt: "Zespół techniczny współpracujący przy stole z kawą i notatkami",
					reverse: true,
				},
			],
		},
		antiSeasonality: {
			eyebrow: "Problem turystyki",
			block: {
				title: "Turystyka jest sezonowa. Praca nie.",
				description:
					"Gospodarze notują 80% rezerwacji w ciągu zaledwie 4 miesięcy. A pozostałe 8? Puste kalendarze. HelloWale wypełnia tę lukę firmami wysyłającymi zespoły na workation przez cały rok.",
			},
			ctaLabel: "Dodaj swoją nieruchomość",
		},
		forHosts: {
			eyebrow: "Dla gospodarzy",
			headline: "Zostań jednym z pierwszych\ngospodarzy w Polsce.",
			paragraph:
				"Współpracujemy z niewielką grupą pierwszych gospodarzy, aby wspólnie kształtować HelloWale. Dołącz już teraz, pomóż nam to zaprojektować i zyskaj ekskluzywne korzyści startowe na zawsze.",
			benefits: forHostsBenefits,
			ctaLabel: "Dodaj swoją nieruchomość — za darmo",
		},
		howItWorks: {
			eyebrow: "Jak to działa",
			headline: "Od rozmowy do workation.",
			subtext:
				"HelloWale startuje w 2026 roku. Oto jak wygląda współpraca już teraz — zanim platforma zostanie uruchomiona.",
			steps: howItWorksSteps,
			ctaLabel: "Porozmawiajmy",
		},
		emailCapture: {
			eyebrow: "Dla freelancerów i pracowników zdalnych",
			headline: "Podróżujesz solo? Dowiedz się pierwszy",
			subtext:
				"Workation to nie tylko dla firm. Jeśli jesteś freelancerem lub pracujesz zdalnie, zostaw swój e-mail, a damy Ci znać, gdy tylko HelloWale otworzy się dla osób indywidualnych.",
			placeholder: "Wpisz swój adres e-mail",
			emailAriaLabel: "Adres e-mail",
			submitAriaLabel: "Wyślij",
			successMessage: "Dzięki — odezwiemy się, gdy przyjdzie Twoja kolej.",
		},
	},
	companiesPage: {
		meta: {
			title: "Dla firm",
			description:
				"Zapewnij swojemu zespołowi benefit wellbeingowy, z którego naprawdę skorzysta — partnerstwa workation z HelloWale.",
		},
		hero: {
			beforeText: "Poza",
			bubbleText: "biurem,",
			afterText: "nie poza ambicjami.",
			subtext: "Stworzone dla firm, gospodarzy i profesjonalistów pracujących zdalnie",
			ctaMaroon: "Rozpocznij workation",
			ctaPeach: "Zacznij hostować",
		},
		howItWorks: {
			eyebrow: "Jak to działa",
			headline: "Zostań partnerem założycielskim",
			subtext:
				"HelloWale startuje w drugiej połowie 2026 roku. Oto jak wygląda współpraca już teraz, zanim platforma będzie dostępna dla wszystkich.",
			steps: howItWorksSteps,
			ctaLabel: "Porozmawiajmy",
		},
		biggerPicture: "Szerszy obraz",
		useCases: {
			items: [
				{
					company: "Agencja marketingowa",
					badge: "25 pracowników",
					description: "Kwartalne workation zespołowe na reset i burzę mózgów przed kolejnymi kampaniami.",
					outcome: "Trzy kampanie. Jedna willa w Toskanii. Zero zmęczenia spotkaniami.",
					imageAlt: "Dwoje współpracowników z agencji marketingowej patrzących razem na laptopa na zewnątrz",
					reverse: false,
				},
				{
					company: "Scale-up technologiczny",
					badge: "100+ pracowników",
					description:
						"Każdy członek zespołu otrzymuje 2 tygodnie workation rocznie w ramach pakietu wellbeingowego.",
					outcome: "Historia retencji, którą opowiadamy na każdej rozmowie rekrutacyjnej.",
					imageAlt: "Zespół techniczny współpracujący przy stole z kawą i notatkami",
					reverse: true,
				},
			],
		},
	},
	hostsPage: {
		meta: {
			title: "Dla gospodarzy",
			description: "Otwórz swoje drzwi na rosnącą społeczność — zostań partnerem założycielem HelloWale.",
		},
		hero: {
			beforeText: "Otwórz",
			bubbleText: "swoje drzwi",
			afterText: "na rosnącą społeczność",
			subtext:
				"Przyjmuj firmy i specjalistów pracujących zdalnie, którzy łączą pracę z podróżą, tworząc nowe możliwości dla Twojej działalności.",
			ctaPartner: "Zostań partnerem",
			ctaListing: "Dodaj ofertę — za darmo",
		},
		forHosts: {
			eyebrow: "Dla gospodarzy",
			headline: "Zostań jednym z pierwszych gospodarzy w Polsce.",
			paragraph:
				"Współpracujemy z niewielką grupą pierwszych gospodarzy, aby wspólnie kształtować HelloWale. Dołącz już teraz, pomóż nam to zaprojektować i zyskaj ekskluzywne korzyści startowe na zawsze.",
			benefits: forHostsBenefits,
			ctaLabel: "Porozmawiajmy",
		},
		biggerPicture: "Szerszy obraz",
		antiSeasonality: {
			blocks: [
				{
					title: "Turystyka jest sezonowa. Praca nie.",
					description:
						"Większość gospodarzy notuje 80% rezerwacji w ciągu zaledwie 4 miesięcy. Co z resztą roku? Puste kalendarze. HelloWale wypełnia tę lukę firmami wysyłającymi zespoły na workacje przez cały rok.",
				},
				{
					title: "Tacy goście, o jakich marzysz",
					description:
						"Zostają trochę dłużej, dbają o Twoją przestrzeń i chętnie polecają ją innym. Efekt? Bardziej przewidywalny dochód, mniej rotacji i lepsze opinie.",
				},
				{
					title: "Dlaczego workation ma sens",
					description:
						"Najlepsze pomysły nie zawsze rodzą się w salach konferencyjnych. Workation łączy zespoły, by współpracowały, odpoczywały i budowały więzi — wzmacniając kulturę firmy i satysfakcję pracowników.",
				},
			],
		},
		howItWorks: {
			eyebrow: "Jak to działa",
			headline: "Zostań partnerem założycielskim",
			subtext:
				"HelloWale startuje w drugiej połowie 2026 roku. Oto jak wygląda współpraca już teraz — zanim platforma będzie dostępna dla wszystkich.",
			steps: howItWorksSteps,
			ctaLabel: "Porozmawiajmy",
		},
	},
	professionalsPage: {
		meta: {
			title: "Dla profesjonalistów zdalnych",
			description: "Zdalna praca nie musi oznaczać samotności — znajdź miejsca dopasowane do Twojego stylu pracy.",
		},
		hero: {
			beforeText: "",
			bubbleText: "Zdalna praca",
			afterText: "nie musi oznaczać samotności",
			subtext:
				"Znajdź miejsca dopasowane do Twojego stylu pracy i poznaj podobnie myślących profesjonalistów, gdziekolwiek jesteś.",
		},
		emailCapture: {
			eyebrow: "Dla freelancerów i pracowników zdalnych",
			headline: "Podróżujesz solo? Dowiedz się pierwszy.",
			subtext:
				"Najlepsze okazje rodzą się z ludzi, których poznajesz. Dotyczy to wszystkiego — od przyjaźni po kontakty zawodowe. Zostaw swój e-mail, a damy Ci znać, gdy tylko HelloWale otworzy się dla osób, które wierzą, że workation lepiej przeżywać z innymi.",
			placeholder: "Wpisz swój adres e-mail",
			emailAriaLabel: "Adres e-mail",
			submitAriaLabel: "Wyślij",
			successMessage: "Dzięki — odezwiemy się, gdy przyjdzie Twoja kolej.",
		},
	},
};
