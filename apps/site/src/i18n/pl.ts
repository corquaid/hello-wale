import type { Dictionary } from "./types";

// Visible copy comes from the final Polish copy docs (HW *_final.docx). Page
// meta, image alt text, and strings the docs don't cover are still the
// first-pass machine-assisted translation and want a native review.

const howItWorksSteps = [
	{
		number: "01",
		title: "Kontaktujesz się z nami",
		description: "Przez formularz na stronie lub mejla. Odpowiemy w ciągu 48 godzin.",
	},
	{
		number: "02",
		title: "Poznajemy Twoje potrzeby",
		description:
			"Krótka rozmowa, w trakcie której dowiemy się, czego potrzebuje Twój zespół lub co oferuje Twój obiekt.",
	},
	{
		number: "03",
		title: "Ustalamy warunki współpracy",
		description: "Dopasujemy nasz model współpracy, stawki oraz pakiet korzyści.",
	},
	{
		number: "04",
		title: "Dołączasz do grona partnerów",
		description:
			"Zyskujesz status partnera-założyciela, a wraz z nim preferencyjne warunki współpracy.",
	},
];

const coCreateBenefit = {
	icon: "co-create",
	title: "Twórz platformę razem z nami",
	description: "Twoje opinie pomogą rozwijać HelloWale.",
};

const featuredBenefit = {
	icon: "featured",
	title: "Zwiększ widoczność od pierwszego dnia",
	description: "Pokażemy Twój obiekt na stronie głównej i w materiałach promocyjnych.",
};

// The home and hosts pages word the 0% benefit differently.
const homeForHostsBenefits = [
	{
		icon: "zero-rates",
		title: "0% prowizji na start",
		description: "Zyskujesz preferencyjne warunki przez pierwsze 3 miesiące współpracy.",
	},
	coCreateBenefit,
	featuredBenefit,
];

const hostsPageForHostsBenefits = [
	{
		icon: "zero-rates",
		title: "0% prowizji na start",
		description: "Zyskujesz preferencyjne warunki.",
	},
	coCreateBenefit,
	featuredBenefit,
];

const validation = {
	lettersOnly: "Użyj jedynie liter z polskiego alfabetu",
	tooShort: "Minimalna liczba znaków: {min}",
	tooLong: "Maksymalna liczba znaków: {max}",
	emailChars: "Możesz użyć znaków @ - _ .",
	emailInvalid: "Wpisz prawidłowy adres e-mail",
	digitsOnly: "Użyj jedynie cyfr",
	tooManyDigits: "Maksymalna liczba cyfr: {max}",
	phoneDigits: "Wpisz {digits} cyfr",
	phoneDigitsRange: "Wpisz od {min} do {max} cyfr",
	freeTextChars: "Usuń znaki specjalne, takie jak < > { } [ ]",
	urlInvalid: "Wpisz prawidłowy link, zaczynający się od https://",
	consentRequired: "Zaznacz zgodę",
};

const formShared = {
	phoneNumber: "Numer telefonu",
	phoneCodeAriaLabel: "Numer kierunkowy kraju",
	consentBefore: "Znam i akceptuję ",
	consentLink: "Politykę prywatności",
	consentAfter: "",
	sending: "Wysyłanie…",
	closeAriaLabel: "Zamknij",
	validation,
};

export const pl: Dictionary = {
	nav: {
		forCompanies: "Dla firm",
		forHosts: "Dla gospodarzy",
		forProfessionals: "Dla profesjonalistów",
		story: "O nas",
		blog: "Blog",
		faq: "FAQ",
		partnerWithUs: "Zostań partnerem",
	},
	common: {
		footer: {
			backToTop: "Powrót do góry",
			columns: {
				companies: {
					heading: "Dla firm",
					links: ["Czym jest workation", "Zostań partnerem", "Cennik", "Studia przypadków"],
				},
				hosts: {
					heading: "Dla gospodarzy",
					links: [
						"Zostań gospodarzem",
						"Korzyści dla gospodarzy-założycieli",
						"Co musisz zapewnić",
					],
				},
				company: {
					heading: "O nas",
					links: ["Nasza historia", "Blog", "Skontaktuj się"],
				},
				legal: {
					heading: "Informacje prawne",
					links: ["Regulamin serwisu", "Polityka prywatności", "Polityka cookie"],
				},
			},
			ctaCards: {
				companies: {
					title: "Dla firm",
					description: "Gotowe rozwiązania workation dla Twojego zespołu",
				},
				hosts: {
					title: "Dla gospodarzy",
					description: "Więcej rezerwacji — przez cały rok",
				},
				guests: {
					title: "Dla gości",
					description: "Podróżuj, pracuj zdalnie, odkrywaj więcej",
				},
			},
			copyright: "© HelloWale {year} · Wszelkie prawa zastrzeżone.",
			designedByPrefix: "Zaprojektowane przez ",
			designedByName: "GreenAgency",
			euFundingNotice: "Z wkładem Programu EISMEA Unii Europejskiej",
		},
		forCompanies: {
			eyebrow: "Dla firm",
			headline: "Benefit wellbeing,\nz którego Twój zespół naprawdę będzie korzystać.",
			subtext:
				"Workation to już nie chwilowy trend ani pusty dodatek. To sprawdzony sposób, dzięki któremu najlepsze zespoły pozostają kreatywne, efektywne i trwale związane z firmą. Z HelloWale możesz łatwo zaoferować taki benefit swoim pracownikom.",
			imageAlt:
				"Zawieszka drzwiowa w stylu hotelowym z napisem „Gdzie praca nie przypomina już pracy” na ciemnych drewnianych drzwiach otoczonych zielenią dżungli",
			benefits: [
				"Koszt niższy, niż myślisz",
				"Silniejsza marka pracodawcy (employer branding)",
				"Wyższa kreatywność zespołów",
				"Niższy współczynnik odejść",
			],
			ctaLabel: "Zostań partnerem",
		},
		whyWellbeing: {
			eyebrow: "Dlaczego wellbeing ma znaczenie",
			headline: "Liczby, które mówią same za siebie.",
			subtext:
				"Dobrostan pracowników często decyduje o tym, czy zespół działa skutecznie, czy zmaga się z wypaleniem zawodowym.",
			stats: [
				{
					value: "77%",
					description: "pracowników doświadcza wypalenia zawodowego",
					source: "Deloitte",
				},
				{
					value: "+13%",
					description:
						"wzrost produktywności w zespołach objętych programami wspierającymi dobrostan pracowników",
					source: "Uniwersytet Oksfordzki",
				},
				{
					value: "3,3×",
					description:
						"większe zaangażowanie pracowników, którzy mają możliwość korzystania z workation i elastycznych form pracy",
					source: "Gallup",
				},
			],
			sourceLabel: "Źródło:",
		},
		scienceOfChange: {
			eyebrow: "Nauka o zmianie",
			headline: "To, gdzie pracujesz,\nwpływa na sposób, w jaki myślisz.",
			subtext:
				"To nie romantyczna wizja, lecz potwierdzony naukowo fakt. Otoczenie jest jednym z najważniejszych czynników wpływających na kreatywność, koncentrację i regenerację. A jednocześnie jest jednym z najłatwiejszych elementów do zmiany.",
			cards: [
				{
					title: "Głębsze skupienie",
					description:
						"To samo biurko. Ten sam widok. Ten sam schemat myślenia. Mózg pomija to, co zna. Gdy zmieniasz otoczenie, zyskujesz nowe spojrzenie.",
					alt: "Przytulne domowe stanowisko pracy z podstawką na laptopa, monitorem i drzewkiem oliwnym przy słonecznym oknie",
				},
				{
					title: "Tam, gdzie łączą się pomysły",
					description:
						"Najlepsze pomysły przychodzą podczas podróży, a nie przy tym samym biurku. Zmiana otoczenia sprawia, że mózg przestaje działać rutynowo — dostrzega nowe połączenia i rozwiązania, które wcześniej umykały.",
					alt: "Mężczyzna pracujący przy biurku z regulacją wysokości, za oknem widać plażę i ocean",
				},
				{
					title: "Miejsca, które przywracają energię",
					description:
						"Tydzień pracy w nowym miejscu często jest bardziej efektywny niż miesiąc spędzony przy biurku. Natura i nowe otoczenie pomagają zregenerować umysł szybciej niż zwykły odpoczynek.",
					alt: "Mężczyzna oddychający świeżym powietrzem na pomoście nad jeziorem, otoczony górami",
				},
			],
		},
		useCases: {
			eyebrow: "Prawdziwe zespoły. Prawdziwe workation.",
			headline: "Rozwiązanie dla zespołów każdej wielkości.",
			subtext: "Trzy sposoby na workation. Jedna platforma, która sprawia, że wszystko działa.",
		},
		bookingsChart: {
			statCaption: "rezerwacji przypada na 4 miesiące w roku.",
			title: "Rezerwacje miesięcznie (dla przeciętnej oferty)",
			monthInitials: ["S", "L", "M", "K", "M", "C", "L", "S", "W", "P", "L", "G"],
			peakLegend: "Wysoki sezon (maj–sierpień)",
			offSeasonLegend: "Poza sezonem — pusty kalendarz",
		},
	},
	homePage: {
		meta: {
			title: "Strona główna",
			description: "HelloWale — platforma dla pobytów łączących pracę zdalną z podróżą.",
		},
		hero: {
			beforeText: "Zmień",
			bubbleText: "biurko",
			afterText: "na widok, który inspiruje",
			subtext:
				"Budujemy platformę dla osób, które chcą pracować zdalnie w dobrych warunkach z dowolnego miejsca. Budujemy coś więcej niż serwis z noclegami. Tworzymy przestrzeń, w której praca i podróżowanie idą w parze.",
			ctaGhost: "Sprawdź ofertę",
			ctaCream: "Dodaj obiekt za darmo",
		},
		whatWeDo: {
			eyebrow: "Łączymy ludzi i miejsca",
			headlineBefore: "Wypalone zespoły.",
			headlineAfter: "Puste kalendarze rezerwacji poza sezonem.",
			headlineLine2: "Mamy na to rozwiązanie.",
			pillars: [
				{
					heading: "Firmy zmagające się z odejściami",
					body: "Przełam rutynę w pracy zespołu. Postaw na wellbeing i zbuduj kulturę organizacyjną, dla której warto zostać i pracować.",
					cta: "Zostań partnerem",
				},
				{
					heading: "Obiekty, które miesiącami czekają na rezerwację",
					body: "Zaproś nową grupę gości — pracowników zdalnych. To dłuższe pobyty, stabilny dochód, rezerwacje przez cały rok.",
					cta: "Dodaj swój obiekt",
				},
				{
					heading: "Dla wszystkich, którzy szukają inspirujących miejsc do pracy",
					body: "Samodzielnie lub w grupach. Na kilka dni, a być może na miesiąc. Odnajdź miejsce, które przyniesie inspiracje.",
					cta: "Dołącz już teraz",
				},
			],
		},
		useCases: {
			items: [
				{
					company: "Agencja marketingowa",
					badge: "25 pracowników",
					description:
						"Kwartalne wyjazdy workation dla całego zespołu, aby złapać nową energię i wspólnie wypracować pomysły na kolejne kampanie.",
					outcome:
						"Trzy kampanie. Jedna willa. Zamiast zmęczenia spotkaniami — świeże pomysły.",
					imageAlt:
						"Dwoje współpracowników z agencji marketingowej patrzących razem na laptopa na zewnątrz",
					reverse: false,
				},
				{
					company: "Firma technologiczna w fazie wzrostu",
					badge: "100 pracowników",
					description:
						"Każdy członek zespołu otrzymuje 2 tygodnie workation rocznie w ramach pakietu wellbeingowego.",
					outcome: "To benefit, o którym mówimy podczas każdej rozmowy kwalifikacyjnej.",
					imageAlt: "Zespół techniczny współpracujący przy stole z kawą i notatkami",
					reverse: true,
				},
			],
		},
		antiSeasonality: {
			eyebrow: "Możesz zyskać",
			block: {
				title: "Turystyka jest sezonowa. Praca nigdy.",
				description:
					"80% rezerwacji przypada na 4 miesiące w roku. A pozostałe 8? Puste kalendarze. HelloWale pomoże Ci wypełnić luki dłuższymi rezerwacjami zdalnych specjalistów i zespołów firmowych — niezależnie od sezonu.",
			},
			ctaLabel: "Dodaj swój obiekt",
		},
		forHosts: {
			eyebrow: "Dla gospodarzy",
			headline: "Dołącz do grona pierwszych\ngospodarzy HelloWale w Polsce",
			paragraph:
				"Budujemy wąskie grono pierwszych partnerów, którzy wspólnie z nami rozwiną HelloWale w Polsce. Dołącz już teraz, miej realny wpływ na nasz sposób działania w kraju i skorzystaj z preferencyjnych warunków współpracy.",
			benefits: homeForHostsBenefits,
			ctaLabel: "Dodaj obiekt — za darmo",
		},
		howItWorks: {
			eyebrow: "Jak to działa",
			headline: "Od pierwszej rozmowy do workation.",
			subtext:
				"HelloWale startuje w 2026 roku. Już dziś zobacz, jak wygląda współpraca — jeszcze przed startem platformy.",
			steps: howItWorksSteps,
			ctaLabel: "Umów rozmowę",
		},
		emailCapture: {
			eyebrow: "Dla pracujących zdalnie i freelancerów",
			headline: "Pracuj z miejsc, w których inni odpoczywają.",
			subtext:
				"Zostaw swojego mejla, a damy Ci znać, kiedy HelloWale będzie dostępne dla osób podróżujących solo.",
			placeholder: "Wpisz adres e-mail",
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
			beforeText: "Adres IP:",
			bubbleText: "inny.",
			afterText: "Kierunek kariery: ten sam.",
			subtext: "Jesteśmy stworzeni dla firm, gospodarzy i pracowników zdalnych.",
			ctaMaroon: "Zostań naszym partnerem",
		},
		howItWorks: {
			eyebrow: "Jak to działa?",
			headline: "Szukamy partnerów, którzy zostaną z nami na lata",
			subtext:
				"HelloWale startuje w 2026 roku. Zostań jednym z naszych pierwszych partnerów, przed oficjalnym otwarciem platformy.",
			steps: howItWorksSteps,
			ctaLabel: "Umów rozmowę",
		},
		biggerPicture: "Spójrz w przyszłość",
		useCases: {
			items: [
				{
					company: "Agencja marketingowa",
					badge: "25 pracowników",
					description:
						"Kwartalne wyjazdy workation dla całego zespołu, aby złapać nową energię i wspólnie wypracować pomysły na kolejne kampanie.",
					outcome:
						"Trzy kampanie. Jedna willa. Zamiast zmęczenia spotkaniami — świeże pomysły.",
					imageAlt:
						"Dwoje współpracowników z agencji marketingowej patrzących razem na laptopa na zewnątrz",
					reverse: false,
				},
				{
					company: "Firma technologiczna w fazie wzrostu",
					badge: "100 pracowników",
					description:
						"Każdy członek zespołu otrzymuje 2 tygodnie workation rocznie w ramach pakietu wellbeingowego.",
					outcome: "To benefit, o którym mówimy podczas każdej rozmowy kwalifikacyjnej.",
					imageAlt: "Zespół techniczny współpracujący przy stole z kawą i notatkami",
					reverse: true,
				},
			],
		},
	},
	hostsPage: {
		meta: {
			title: "Dla gospodarzy",
			description:
				"Otwórz swoje drzwi na rosnącą społeczność — zostań partnerem założycielem HelloWale.",
		},
		hero: {
			beforeText: "Dołącz do",
			bubbleText: "rosnącej",
			afterText: "społeczności",
			subtext:
				"Zapełnij kalendarz rezerwacjami i zapewnij sobie stały dochód przez cały rok. Otwórz drzwi dla cyfrowych nomadów i przyciągnij klientów biznesowych.",
			ctaListing: "Dołącz za darmo",
		},
		forHosts: {
			eyebrow: "Dla gospodarzy",
			headline: "Dołącz do pierwszych gospodarzy HelloWale w Polsce",
			paragraph:
				"Budujemy małą grupę pierwszych partnerów, którzy wspólnie z nami rozwiną HelloWale w Polsce. Dołącz już teraz, miej realny wpływ na nasze warunki działania w kraju. Otrzymasz pakiet dodatkowych korzyści dla pierwszych partnerów.",
			benefits: hostsPageForHostsBenefits,
			ctaLabel: "Umów rozmowę",
		},
		biggerPicture: "Rynek, który dopiero rośnie",
		antiSeasonality: {
			blocks: [
				{
					title: "Turystyka jest sezonowa. Praca nigdy.",
					description:
						"80% rezerwacji przypada na 4 miesiące w roku. A pozostałe 8? Puste kalendarze. HelloWale pomoże Ci wypełnić luki dłuższymi rezerwacjami zdalnych specjalistów i zespołów firmowych — niezależnie od sezonu.",
				},
				{
					title: "Goście, których chcesz mieć u siebie",
					description:
						"Zostają na dłużej, szanują miejsce, w którym mieszkają, i chętnie polecają je innym. Efekt? Bardziej przewidywalne przychody, mniej pustych terminów i lepsze opinie.",
				},
				{
					title: "Dlaczego „workation” jest warte Twojej uwagi?",
					description:
						"Firmy coraz chętniej wprowadzają „workation” jako nową formę pracy. Szukają miejsc, w których zespoły będą współpracować, budować relacje i odzyskają energię do pracy.",
				},
			],
		},
		howItWorks: {
			eyebrow: "Jak to działa?",
			headline: "Szukamy pierwszych partnerów, którzy zostaną z nami na lata",
			subtext:
				"HelloWale startuje w 2026 roku. Zostań jednym z naszych pierwszych partnerów, przed oficjalnym otwarciem platformy.",
			steps: howItWorksSteps,
			ctaLabel: "Umów rozmowę",
		},
	},
	professionalsPage: {
		meta: {
			title: "Dla profesjonalistów zdalnych",
			description:
				"Zdalna praca nie musi oznaczać samotności — znajdź miejsca dopasowane do Twojego stylu pracy.",
		},
		hero: {
			beforeText: "",
			bubbleText: "Miejsca,",
			afterText: "w których praca przychodzi naturalnie",
			subtext:
				"Znajdź miejsca przygotowane z myślą o pracy zdalnej, a nie zwyczajne noclegi. Zarezerwuj pobyt, który pomoże Ci utrzymać rytm pracy podczas podróży.",
		},
		emailCapture: {
			eyebrow: "Dla pracujących zdalnie i freelancerów",
			headline: "Bądź wśród pierwszych osób, które powiadomimy",
			subtext:
				"Otwórz się na nowe możliwości, miejsca i ludzi. Czasami nowe możliwości pojawiają się wraz z ludźmi, których spotykasz. Zostaw swój e-mail i dołącz do listy zainteresowanych. Damy Ci znać, kiedy HelloWale będzie dostępne dla osób, które wierzą, że workation jest lepsze, gdy można dzielić je z innymi.",
			placeholder: "Wpisz adres e-mail",
			emailAriaLabel: "Adres e-mail",
			submitAriaLabel: "Wyślij",
			successMessage: "Dzięki — odezwiemy się, gdy przyjdzie Twoja kolej.",
		},
	},
	becomeAHostPage: {
		meta: {
			title: "Zostań gospodarzem",
			description:
				"Dołącz do grona pierwszych gospodarzy HelloWale w Polsce — opowiedz nam o swoim obiekcie.",
		},
		headline: "Opowiedz nam o swoim obiekcie.",
		intro: "Skontaktujemy się osobiście. Zostaw swoje dane, a my odezwiemy się w ciągu kilku dni.",
		benefitsHeading: "✳ KORZYŚCI DLA GOSPODARZY-ZAŁOŻYCIELI",
		// From "PDF - For Hosts - Print", which lists the same four benefits.
		benefits: [
			{ title: "0% prowizji", description: "Przez pierwsze miesiące nie zapłacisz prowizji." },
			{
				title: "Wyróżnimy Twój obiekt",
				description: "Pokażemy go na stronie głównej i w materiałach promocyjnych.",
			},
			{
				title: "Twórz HelloWale razem z nami",
				description: "Twoje opinie pomogą nam się rozwijać.",
			},
			{
				title: "Niższe opłaty na stałe",
				description: "Pierwsi gospodarze skorzystają z preferencyjnych warunków współpracy.",
			},
		],
		footnote: "✳ Dodanie obiektu jest bezpłatne. Odpowiadamy w ciągu 48 godzin.",
		formTitle: "Formularz kontaktowy dla gospodarzy",
		formSubtext:
			"Podaj kilka informacji o sobie i swoim obiekcie — odezwiemy się i wprowadzimy Cię w szczegóły programu dla gospodarzy-założycieli.",
		form: {
			...formShared,
			sections: {
				aboutYou: "O Tobie",
				aboutSpace: "O Twoim obiekcie",
				workReady: "Czy obiekt jest przygotowany do pracy?",
				workReadySubtext: "Zaznacz wszystko, co pasuje — to pomoże nam ocenić dopasowanie.",
				availability: "Kiedy obiekt jest dostępny?",
				listedElsewhere: "Czy obiekt jest już dostępny na innych platformach?",
				listedElsewhereSubtext: "Opcjonalnie — pomoże nam to lepiej poznać Twoją ofertę.",
				story: "Dodaj krótki opis obiektu (opcjonalnie)",
				storySubtext: "Co sprawia, że Twój obiekt świetnie nadaje się do pracy?",
			},
			fields: {
				fullName: { label: "Imię i nazwisko", placeholder: "np. Anna Kowalska" },
				email: { label: "E-mail", placeholder: "ty@firma.pl" },
				propertyName: {
					label: "Nazwa obiektu",
					placeholder: "np. Casa Amelia, Chata w górach, Studio 42",
				},
				city: { label: "Miasto", placeholder: "np. Zakopane" },
				country: { label: "Kraj", placeholder: "np. Polska" },
				propertyType: { label: "Typ obiektu", placeholder: "Wybierz typ" },
				guestCapacity: { label: "Ilu gości może przyjąć?", placeholder: "Wybierz liczbę" },
				bedrooms: { label: "Sypialnie", placeholder: "Wybierz" },
				workReadyOther: {
					label: "Coś jeszcze? (opcjonalnie)",
					placeholder:
						"np. biurko do pracy na stojąco, zadaszone miejsce do pracy na zewnątrz, drugi monitor",
				},
				airbnbUrl: "Link do Airbnb",
				bookingUrl: "Link do Booking.com",
				months: "Które miesiące? Zaznacz wszystkie, które pasują.",
				storyPlaceholder:
					"Wifi, ergonomiczne biurko, widoki — wszystko, co warto powiedzieć gościom.",
			},
			propertyTypes: {
				apartment: "Apartament",
				house: "Dom / Willa",
				cabin: "Domek / Chata",
				studio: "Studio",
				other: "Inny",
			},
			bedroomStudio: "Studio",
			workReadyOptions: {
				wifi: "Szybkie Wi-Fi (100+ Mb/s)",
				desk: "Osobne biurko / miejsce do pracy",
				quiet: "Cisza w godzinach pracy",
				kitchen: "W pełni wyposażona kuchnia",
				nature: "Bliskość natury / dostęp do terenu na zewnątrz",
				coffee: "Kawa, herbata i woda w cenie",
			},
			availabilityOptions: {
				yearRound: "Przez cały rok",
				offSeason: "Głównie poza sezonem (paź—kwi)",
				specificMonths: "Tylko w wybrane miesiące",
			},
			monthNames: [
				"Styczeń",
				"Luty",
				"Marzec",
				"Kwiecień",
				"Maj",
				"Czerwiec",
				"Lipiec",
				"Sierpień",
				"Wrzesień",
				"Październik",
				"Listopad",
				"Grudzień",
			],
			required: {
				fullName: "Wpisz imię i nazwisko",
				email: "Wpisz adres e-mail",
				propertyName: "Wpisz nazwę obiektu",
				city: "Wpisz miasto",
				country: "Wpisz kraj",
				propertyType: "Wybierz typ obiektu",
				guestCapacity: "Wybierz liczbę gości",
				bedrooms: "Wybierz liczbę sypialni",
			},
			error: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub napisz do nas bezpośrednio.",
			submit: "Wyślij zgłoszenie",
			footnote:
				"Na tym etapie nie zobowiązujesz się do niczego. Twoje dane wykorzystamy tylko, żeby odpowiedzieć — żadnego spamu, nigdy.",
			modal: {
				title: "Twój obiekt jest na naszym radarze!",
				body: "Dziękujemy za zgłoszenie. Odpowiemy w ciągu 48 godzin — osoba z naszego zespołu przeprowadzi Cię przez kolejne kroki. Potwierdzenie wysłaliśmy też na Twój adres e-mail.",
				closeLabel: "Gotowe",
				secondaryLabel: "Zobacz, co wyróżnia dobre miejsce na workation →",
			},
		},
	},
	partnerWithUsPage: {
		meta: {
			title: "Zostań partnerem",
			description:
				"Stwórzmy razem program workation dla Twojego zespołu — zostań partnerem HelloWale.",
		},
		headline: "Stwórzmy razem program workation dla Twojego zespołu",
		intro:
			"Współpracujemy z firmami, które myślą o przyszłości pracy i chcą oferować swoim pracownikom więcej niż standardowe benefity. Dołącz teraz i zyskaj pakiet korzyści.",
		benefitsHeading: "PAKIET KORZYŚCI DLA PIERWSZYCH PARTNERÓW",
		benefits: [
			"Niższa, gwarantowana cena subskrypcji — na zawsze",
			"Preferencyjne stawki rezerwacji dla pracowników",
			"Możliwość współtworzenia platformy HelloWale",
			"Wyróżnienie jako partner",
		],
		formTitle: "Zapytaj o współpracę",
		formSubtext: "Wypełnienie formularza zajmie Ci około 2 minut.",
		form: {
			...formShared,
			sections: {
				aboutYou: "O Tobie",
				aboutCompany: "O Twojej firmie",
				intents: "Co Cię do nas sprowadza?",
				intentsSubtext: "Wybierz 1 lub więcej odpowiedzi.",
				message: "Chcesz dodać coś jeszcze?",
				messageSubtext: "To opcjonalne, ale dzięki temu lepiej zrozumiemy Twoje potrzeby.",
			},
			fields: {
				fullName: { label: "Imię i nazwisko", placeholder: "np. Anna Kowalska" },
				workEmail: { label: "Firmowy adres e-mail", placeholder: "ty@firma.pl" },
				jobTitle: { label: "Stanowisko", placeholder: "np. Dyrektor HR, Założyciel, HR Manager" },
				companyName: { label: "Nazwa", placeholder: "np. Green Studio" },
				teamSize: { label: "Liczba osób w zespole", placeholder: "Wpisz liczbę" },
				country: { label: "Kraj", placeholder: "np. Polska" },
				messagePlaceholder:
					"Napisz, czego oczekujesz od współpracy z HelloWale, jakie wyjazdy rozważasz lub jakie masz pytania...",
			},
			intents: {
				wellbeing: {
					title: "Benefit wellbeingowy",
					description: "Wsparcie dobrostanu pracowników, przez cały rok.",
				},
				retreats: {
					title: "Wyjazdy zespołowe",
					description: "Offsite-y, tygodnie planowania i integracje.",
				},
				individual: {
					title: "Benefit indywidualny",
					description: "Indywidualny benefit dla osób pracujących zdalnie.",
				},
				curious: { title: "Chcę dowiedzieć się więcej", description: "Sprawdzam możliwości." },
			},
			required: {
				fullName: "Wpisz imię i nazwisko",
				workEmail: "Wpisz firmowy adres e-mail",
				phone: "Wpisz numer telefonu",
				companyName: "Wpisz nazwę firmy",
				teamSize: "Wpisz, z ilu osób składa się Twój zespół",
				country: "Wpisz, z jakiego kraju jest Twoja firma",
				intents: "Wybierz co najmniej jedną opcję",
			},
			error: "Nie udało się wysłać zapytania. Spróbuj ponownie lub napisz do nas bezpośrednio.",
			submit: "Wyślij",
			footnote: "Odezwiemy się w ciągu 48 godzin. Bez nachalnej sprzedaży.",
			modal: {
				title: "Zgłoszenie przyjęte!",
				body: "Dziękujemy. W ciągu 48 godzin skontaktuje się z Tobą osoba z naszego zespołu. Potwierdzenie wysłaliśmy też na Twój adres e-mail.",
				closeLabel: "Zamknij",
				secondaryLabel: "Sprawdź naszego bloga →",
			},
		},
	},
	contactPage: {
		meta: {
			title: "Kontakt",
			description: "Skontaktuj się z nami.",
		},
		headline: "Skontaktuj się z nami",
		subtext: "Masz pytanie? Napisz do nas poniżej.",
		form: {
			name: "Imię i nazwisko",
			email: "E-mail",
			message: "Wiadomość",
			error: "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
			sending: "Wysyłanie…",
			submit: "Wyślij wiadomość",
			successTitle: "Dziękujemy za wiadomość!",
			successBody: "Odezwiemy się wkrótce.",
			validation,
			required: {
				name: "Wpisz imię i nazwisko",
				email: "Wpisz adres e-mail",
				message: "Wpisz wiadomość",
			},
		},
	},
};
