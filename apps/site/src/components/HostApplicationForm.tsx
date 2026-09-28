import { useState } from "react";
import applicationSentIcon from "../assets/images/partner-application-sent.png";
import SentModal from "./SentModal";
import type {
	AvailabilityKey,
	HostApplicationFormCopy,
	PropertyTypeKey,
	WorkReadyKey,
} from "../i18n/types";
import {
	checkEmail,
	checkFreeText,
	checkName,
	checkPhone,
	checkText,
	checkUrl,
	collectErrors,
	focusFirstError,
	LIMITS,
	type FieldErrors,
} from "./formValidation";
import {
	ConsentCheckbox,
	consentText,
	errorProps,
	FieldError,
	inputClass,
	labelClass,
	SectionHeader,
	textareaClass,
} from "./formPrimitives";

// Same public/no-secret HubSpot Forms Submission API as PartnerEnquiryForm.tsx
// — see the comment there for how it works. This uses a separate HubSpot form
// (same account/portal, different form). Standard contact properties used:
// email, firstname, lastname, phone, city, country. Custom properties needed:
// property_name, property_type, guest_capacity, bedrooms, work_ready_features
// (;-joined), work_ready_other, availability, availability_months (;-joined —
// only submitted when availability is "Specific months only"), airbnb_url,
// booking_url, space_story. Fields not on the form are silently rejected.
const HUBSPOT_PORTAL_ID = import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID;
const HUBSPOT_FORM_GUID = import.meta.env.PUBLIC_HUBSPOT_HOST_FORM_GUID;

const PHONE_CODES = [
	{ code: "+48", label: "🇵🇱 +48" },
	{ code: "+44", label: "🇬🇧 +44" },
	{ code: "+49", label: "🇩🇪 +49" },
	{ code: "+33", label: "🇫🇷 +33" },
	{ code: "+420", label: "🇨🇿 +420" },
	{ code: "+1", label: "🇺🇸 +1" },
];

// The `value`s below are what HubSpot stores, and must match the option lists
// on the HubSpot properties — they stay in English whatever the page locale.
// Only the visible labels come from `copy`.
const PROPERTY_TYPES: { key: PropertyTypeKey; value: string }[] = [
	{ key: "apartment", value: "Apartment" },
	{ key: "house", value: "House / Villa" },
	{ key: "cabin", value: "Cabin / Cottage" },
	{ key: "studio", value: "Studio" },
	{ key: "other", value: "Other" },
];
const GUEST_CAPACITIES = ["1-2", "3-4", "5-6", "7-10", "10+"];
const BEDROOM_STUDIO = "Studio";
const BEDROOM_COUNTS = [BEDROOM_STUDIO, "1", "2", "3", "4+"];

const WORK_READY_OPTIONS: WorkReadyKey[] = ["wifi", "desk", "quiet", "kitchen", "nature", "coffee"];

const AVAILABILITY_OPTIONS: { key: AvailabilityKey; value: string }[] = [
	{ key: "yearRound", value: "Year-round" },
	{ key: "offSeason", value: "Mostly off-season (Oct—Apr)" },
	{ key: "specificMonths", value: "Specific months only" },
];
const SPECIFIC_MONTHS_OPTION = AVAILABILITY_OPTIONS[2].value;

const MONTHS = [
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
];

interface Props {
	copy: HostApplicationFormCopy;
	blogHref: string;
}

export default function HostApplicationForm({ copy, blogHref }: Props) {
	const [status, setStatus] = useState<"idle" | "sending" | "submitted" | "error">("idle");
	const [showModal, setShowModal] = useState(false);
	const [availability, setAvailability] = useState(AVAILABILITY_OPTIONS[0].value);
	const [errors, setErrors] = useState<FieldErrors>({});

	function clearError(event: React.FormEvent<HTMLFormElement>) {
		const name = (event.target as HTMLInputElement).name;
		if (errors[name]) setErrors(({ [name]: _cleared, ...rest }) => rest);
	}

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;
		const data = new FormData(form);

		const fullName = String(data.get("fullName") ?? "").trim();
		const [firstName, ...rest] = fullName.split(" ");
		const lastName = rest.join(" ");
		const email = String(data.get("email") ?? "").trim();
		const phoneCode = String(data.get("phoneCode") ?? "");
		const phoneNumber = String(data.get("phoneNumber") ?? "").trim();
		const phone = phoneNumber ? `${phoneCode}${phoneNumber.replace(/\s+/g, "")}` : "";
		const propertyName = String(data.get("propertyName") ?? "").trim();
		const city = String(data.get("city") ?? "").trim();
		const country = String(data.get("country") ?? "").trim();
		const propertyType = String(data.get("propertyType") ?? "").trim();
		const guestCapacity = String(data.get("guestCapacity") ?? "").trim();
		const bedrooms = String(data.get("bedrooms") ?? "").trim();
		const workReadyFeatures = data.getAll("workReady").map(String);
		const workReadyOther = String(data.get("workReadyOther") ?? "").trim();
		const availabilityValue = String(data.get("availability") ?? "").trim();
		const availabilityMonths =
			availabilityValue === SPECIFIC_MONTHS_OPTION
				? data.getAll("availabilityMonths").map(String)
				: [];
		const airbnbUrl = String(data.get("airbnbUrl") ?? "").trim();
		const bookingUrl = String(data.get("bookingUrl") ?? "").trim();
		const spaceStory = String(data.get("spaceStory") ?? "").trim();
		const consented = data.get("consent") === "on";

		const { validation, required } = copy;
		const fieldErrors = collectErrors({
			fullName: checkName(fullName, validation, required.fullName),
			email: checkEmail(email, validation, required.email),
			phoneNumber: checkPhone(phoneCode, phoneNumber, validation),
			propertyName: checkText(propertyName, LIMITS.propertyName, validation, required.propertyName),
			city: checkText(city, LIMITS.shortText, validation, required.city),
			country: checkText(country, LIMITS.shortText, validation, required.country),
			propertyType: propertyType ? undefined : required.propertyType,
			guestCapacity: guestCapacity ? undefined : required.guestCapacity,
			bedrooms: bedrooms ? undefined : required.bedrooms,
			workReadyOther: checkFreeText(workReadyOther, validation),
			airbnbUrl: checkUrl(airbnbUrl, validation),
			bookingUrl: checkUrl(bookingUrl, validation),
			spaceStory: checkFreeText(spaceStory, validation),
			consent: consented ? undefined : validation.consentRequired,
		});
		setErrors(fieldErrors);
		if (Object.keys(fieldErrors).length > 0) {
			focusFirstError(form, fieldErrors);
			return;
		}

		setStatus("sending");

		const hubspotFields = [
			{ objectTypeId: "0-1", name: "email", value: email },
			{ objectTypeId: "0-1", name: "firstname", value: firstName ?? "" },
			{ objectTypeId: "0-1", name: "lastname", value: lastName },
			{ objectTypeId: "0-1", name: "phone", value: phone },
			{ objectTypeId: "0-1", name: "property_name", value: propertyName },
			{ objectTypeId: "0-1", name: "city", value: city },
			{ objectTypeId: "0-1", name: "country", value: country },
			{ objectTypeId: "0-1", name: "property_type", value: propertyType },
			{ objectTypeId: "0-1", name: "guest_capacity", value: guestCapacity },
			{ objectTypeId: "0-1", name: "bedrooms", value: bedrooms },
			{ objectTypeId: "0-1", name: "work_ready_features", value: workReadyFeatures.join(";") },
			{ objectTypeId: "0-1", name: "work_ready_other", value: workReadyOther },
			{ objectTypeId: "0-1", name: "availability", value: availabilityValue },
			{ objectTypeId: "0-1", name: "availability_months", value: availabilityMonths.join(";") },
			{ objectTypeId: "0-1", name: "airbnb_url", value: airbnbUrl },
			{ objectTypeId: "0-1", name: "booking_url", value: bookingUrl },
			{ objectTypeId: "0-1", name: "space_story", value: spaceStory },
		].filter((field) => field.value !== "");

		if (!HUBSPOT_PORTAL_ID || !HUBSPOT_FORM_GUID) {
			console.error(
				"HubSpot is not configured: missing PUBLIC_HUBSPOT_PORTAL_ID / PUBLIC_HUBSPOT_HOST_FORM_GUID",
			);
			setStatus("error");
			return;
		}

		try {
			const response = await fetch(
				`https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						fields: hubspotFields,
						context: { pageUri: window.location.href, pageName: document.title },
						legalConsentOptions: {
							consent: {
								consentToProcess: consented,
								text: consentText(copy),
							},
						},
					}),
				},
			);

			if (!response.ok) {
				const errorBody = await response.json().catch(() => null);
				console.error("HubSpot submission failed:", response.status, errorBody);
				throw new Error("HubSpot submission failed");
			}
			setStatus("submitted");
			setShowModal(true);
		} catch (error) {
			console.error("HubSpot submission failed:", error);
			setStatus("error");
		}
	}

	return (
		<>
			{showModal && (
				<SentModal
					icon={applicationSentIcon.src}
					title={copy.modal.title}
					body={copy.modal.body}
					closeLabel={copy.modal.closeLabel}
					closeButtonVariant="peach"
					secondaryLabel={copy.modal.secondaryLabel}
					secondaryHref={blogHref}
					closeAriaLabel={copy.closeAriaLabel}
					onClose={() => setShowModal(false)}
				/>
			)}
			<form
				onSubmit={handleSubmit}
				onInput={clearError}
				noValidate
				className="flex flex-col gap-10"
			>
				<div className="flex flex-col gap-4">
					<SectionHeader number={1} title={copy.sections.aboutYou} />
					<div className="flex flex-col gap-2">
						<label htmlFor="fullName" className={labelClass}>
							{copy.fields.fullName.label} <span className="text-wale-800 font-bold">*</span>
						</label>
						<input
							id="fullName"
							name="fullName"
							{...errorProps(errors, "fullName")}
							type="text"
							required
							placeholder={copy.fields.fullName.placeholder}
							className={inputClass}
						/>
						<FieldError errors={errors} name="fullName" />
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="email" className={labelClass}>
							{copy.fields.email.label} <span className="text-wale-800 font-bold">*</span>
						</label>
						<input
							id="email"
							name="email"
							{...errorProps(errors, "email")}
							type="email"
							required
							placeholder={copy.fields.email.placeholder}
							className={inputClass}
						/>
						<FieldError errors={errors} name="email" />
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="phoneNumber" className={labelClass}>
							{copy.phoneNumber}
						</label>
						<div className="flex gap-1">
							<select
								id="phoneCode"
								name="phoneCode"
								defaultValue="+48"
								aria-label={copy.phoneCodeAriaLabel}
								className="text-wale-800 focus:ring-wale-700/30 border-wale-700/15 rounded-lg border bg-white px-3 py-5 text-sm focus:ring-2 focus:outline-none"
							>
								{PHONE_CODES.map((entry) => (
									<option key={entry.code} value={entry.code}>
										{entry.label}
									</option>
								))}
							</select>
							<input
								id="phoneNumber"
								name="phoneNumber"
								{...errorProps(errors, "phoneNumber")}
								type="tel"
								placeholder="600 123 456"
								className={`${inputClass} flex-1`}
							/>
						</div>
						<FieldError errors={errors} name="phoneNumber" />
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader number={2} title={copy.sections.aboutSpace} />
					<div className="flex flex-col gap-2">
						<label htmlFor="propertyName" className={labelClass}>
							{copy.fields.propertyName.label} <span className="text-wale-800 font-bold">*</span>
						</label>
						<input
							id="propertyName"
							name="propertyName"
							{...errorProps(errors, "propertyName")}
							type="text"
							required
							placeholder={copy.fields.propertyName.placeholder}
							className={inputClass}
						/>
						<FieldError errors={errors} name="propertyName" />
					</div>
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="city" className={labelClass}>
								{copy.fields.city.label} <span className="text-wale-800 font-bold">*</span>
							</label>
							<input
								id="city"
								name="city"
								{...errorProps(errors, "city")}
								type="text"
								required
								placeholder={copy.fields.city.placeholder}
								className={inputClass}
							/>
							<FieldError errors={errors} name="city" />
						</div>
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="country" className={labelClass}>
								{copy.fields.country.label} <span className="text-wale-800 font-bold">*</span>
							</label>
							<input
								id="country"
								name="country"
								{...errorProps(errors, "country")}
								type="text"
								required
								placeholder={copy.fields.country.placeholder}
								className={inputClass}
							/>
							<FieldError errors={errors} name="country" />
						</div>
					</div>
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="propertyType" className={labelClass}>
								{copy.fields.propertyType.label} <span className="text-wale-800 font-bold">*</span>
							</label>
							<select
								id="propertyType"
								name="propertyType"
								{...errorProps(errors, "propertyType")}
								required
								defaultValue=""
								className={inputClass}
							>
								<option value="" disabled>
									{copy.fields.propertyType.placeholder}
								</option>
								{PROPERTY_TYPES.map((type) => (
									<option key={type.key} value={type.value}>
										{copy.propertyTypes[type.key]}
									</option>
								))}
							</select>
							<FieldError errors={errors} name="propertyType" />
						</div>
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="guestCapacity" className={labelClass}>
								{copy.fields.guestCapacity.label} <span className="text-wale-800 font-bold">*</span>
							</label>
							<select
								id="guestCapacity"
								name="guestCapacity"
								{...errorProps(errors, "guestCapacity")}
								required
								defaultValue=""
								className={inputClass}
							>
								<option value="" disabled>
									{copy.fields.guestCapacity.placeholder}
								</option>
								{GUEST_CAPACITIES.map((capacity) => (
									<option key={capacity} value={capacity}>
										{capacity}
									</option>
								))}
							</select>
							<FieldError errors={errors} name="guestCapacity" />
						</div>
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="bedrooms" className={labelClass}>
								{copy.fields.bedrooms.label} <span className="text-wale-800 font-bold">*</span>
							</label>
							<select
								id="bedrooms"
								name="bedrooms"
								{...errorProps(errors, "bedrooms")}
								required
								defaultValue=""
								className={inputClass}
							>
								<option value="" disabled>
									{copy.fields.bedrooms.placeholder}
								</option>
								{BEDROOM_COUNTS.map((count) => (
									<option key={count} value={count}>
										{count === BEDROOM_STUDIO ? copy.bedroomStudio : count}
									</option>
								))}
							</select>
							<FieldError errors={errors} name="bedrooms" />
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader
						number={3}
						title={copy.sections.workReady}
						subtext={copy.sections.workReadySubtext}
					/>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{WORK_READY_OPTIONS.map((option) => (
							<label key={option} className="flex cursor-pointer items-center gap-3">
								<input type="checkbox" name="workReady" value={option} className="peer sr-only" />
								<span className="border-wale-700/30 peer-checked:border-wale-700 peer-checked:bg-wale-700 flex size-5 shrink-0 items-center justify-center rounded border bg-white text-transparent peer-checked:text-white">
									✓
								</span>
								<span className="text-wale-800 text-sm">{copy.workReadyOptions[option]}</span>
							</label>
						))}
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="workReadyOther" className={labelClass}>
							{copy.fields.workReadyOther.label}
						</label>
						<input
							id="workReadyOther"
							name="workReadyOther"
							{...errorProps(errors, "workReadyOther")}
							type="text"
							placeholder={copy.fields.workReadyOther.placeholder}
							className={inputClass}
						/>
						<FieldError errors={errors} name="workReadyOther" />
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader number={4} title={copy.sections.availability} />
					<div className="flex flex-wrap gap-2">
						{AVAILABILITY_OPTIONS.map((option) => (
							<label key={option.key} className="cursor-pointer">
								<input
									type="radio"
									name="availability"
									value={option.value}
									checked={availability === option.value}
									onChange={() => setAvailability(option.value)}
									className="peer sr-only"
								/>
								<span className="peer-checked:bg-wale-700 border-wale-700/15 text-wale-800 inline-flex items-center rounded-full border bg-white px-5 py-2.5 text-sm font-medium transition-colors peer-checked:text-white">
									{copy.availabilityOptions[option.key]}
								</span>
							</label>
						))}
					</div>
					{availability === SPECIFIC_MONTHS_OPTION && (
						<div className="flex flex-col gap-2">
							<span className={labelClass}>{copy.fields.months}</span>
							<div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
								{MONTHS.map((month, index) => (
									<label key={month} className="cursor-pointer">
										<input
											type="checkbox"
											name="availabilityMonths"
											value={month}
											className="peer sr-only"
										/>
										<span className="peer-checked:bg-wale-700 peer-checked:border-wale-700 border-wale-700/15 text-wale-800 flex items-center justify-center rounded-lg border bg-white px-3 py-2.5 text-sm font-medium transition-colors peer-checked:text-white">
											{copy.monthNames[index]}
										</span>
									</label>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader
						number={5}
						title={copy.sections.listedElsewhere}
						subtext={copy.sections.listedElsewhereSubtext}
					/>
					<div className="flex flex-col gap-2">
						<label htmlFor="airbnbUrl" className={labelClass}>
							{copy.fields.airbnbUrl}
						</label>
						<input
							id="airbnbUrl"
							name="airbnbUrl"
							{...errorProps(errors, "airbnbUrl")}
							type="url"
							placeholder="https://airbnb.com/..."
							className={inputClass}
						/>
						<FieldError errors={errors} name="airbnbUrl" />
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="bookingUrl" className={labelClass}>
							{copy.fields.bookingUrl}
						</label>
						<input
							id="bookingUrl"
							name="bookingUrl"
							{...errorProps(errors, "bookingUrl")}
							type="url"
							placeholder="https://booking.com/..."
							className={inputClass}
						/>
						<FieldError errors={errors} name="bookingUrl" />
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader
						number={6}
						title={copy.sections.story}
						subtext={copy.sections.storySubtext}
					/>
					<textarea
						name="spaceStory"
						{...errorProps(errors, "spaceStory")}
						rows={4}
						placeholder={copy.fields.storyPlaceholder}
						className={textareaClass}
					/>
					<FieldError errors={errors} name="spaceStory" />
				</div>

				<div className="flex flex-col gap-5">
					<ConsentCheckbox copy={copy} errors={errors} />

					{status === "error" && <p className="text-sm text-red-600">{copy.error}</p>}

					<button
						type="submit"
						disabled={status === "sending"}
						className="bg-wale-700 font-display hover:bg-wale-800 inline-flex w-fit items-center gap-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl px-12 py-5 text-base font-medium tracking-[0.08px] text-white disabled:opacity-50"
					>
						{status === "sending" ? copy.sending : copy.submit}
						<span aria-hidden="true">→</span>
					</button>
					<p className="text-wale-800/55 text-sm">{copy.footnote}</p>
				</div>
			</form>
		</>
	);
}
