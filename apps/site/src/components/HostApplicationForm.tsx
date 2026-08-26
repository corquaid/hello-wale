import { useState } from "react";
import applicationSentIcon from "../assets/images/partner-application-sent.png";
import SentModal from "./SentModal";
import {
	ConsentCheckbox,
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
// (;-joined), work_ready_other, availability, airbnb_url, booking_url,
// space_story. Fields not on the form are silently rejected.
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

const PROPERTY_TYPES = ["Apartment", "House / Villa", "Cabin / Cottage", "Studio", "Other"];
const GUEST_CAPACITIES = ["1-2", "3-4", "5-6", "7-10", "10+"];
const BEDROOM_COUNTS = ["Studio", "1", "2", "3", "4+"];

const WORK_READY_OPTIONS = [
	{ value: "wifi", label: "Fast Wi-Fi (100+ Mbps)" },
	{ value: "desk", label: "Dedicated desk / workspace" },
	{ value: "quiet", label: "Quiet during working hours" },
	{ value: "kitchen", label: "Full kitchen" },
	{ value: "nature", label: "Nature / outdoor access" },
	{ value: "coffee", label: "Coffee, tea, water included" },
];

const AVAILABILITY_OPTIONS = ["Year-round", "Mostly off-season (Oct—Apr)", "Specific months only"];

export default function HostApplicationForm() {
	const [status, setStatus] = useState<"idle" | "sending" | "submitted" | "error">("idle");
	const [showModal, setShowModal] = useState(false);

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatus("sending");

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
		const availability = String(data.get("availability") ?? "").trim();
		const airbnbUrl = String(data.get("airbnbUrl") ?? "").trim();
		const bookingUrl = String(data.get("bookingUrl") ?? "").trim();
		const spaceStory = String(data.get("spaceStory") ?? "").trim();
		const consented = data.get("consent") === "on";

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
			{ objectTypeId: "0-1", name: "availability", value: availability },
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
								text: "I've read and agree to the Privacy Policy.",
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
					title="Your space is on our radar!"
					body="Thanks for applying as a founding host. We'll reply within 48 hours — a real person will walk you through the next steps. A confirmation is already in your inbox."
					closeLabel="Done"
					closeButtonVariant="peach"
					secondaryLabel="See what makes a great workation stay →"
					secondaryHref={`${import.meta.env.BASE_URL}blog`}
					onClose={() => setShowModal(false)}
				/>
			)}
			<form onSubmit={handleSubmit} className="flex flex-col gap-10">
				<div className="flex flex-col gap-4">
					<SectionHeader number={1} title="About you" />
					<div className="flex flex-col gap-2">
						<label htmlFor="fullName" className={labelClass}>
							Full name <span className="text-wale-800 font-bold">*</span>
						</label>
						<input
							id="fullName"
							name="fullName"
							type="text"
							required
							placeholder="e.g. Elena Novak"
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="email" className={labelClass}>
							Email <span className="text-wale-800 font-bold">*</span>
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							placeholder="you@company.com"
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="phoneNumber" className={labelClass}>
							Phone Number
						</label>
						<div className="flex gap-1">
							<select
								id="phoneCode"
								name="phoneCode"
								defaultValue="+420"
								aria-label="Country calling code"
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
								type="tel"
								placeholder="600 123 456"
								className={`${inputClass} flex-1`}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader number={2} title="About your space" />
					<div className="flex flex-col gap-2">
						<label htmlFor="propertyName" className={labelClass}>
							Property name <span className="text-wale-800 font-bold">*</span>
						</label>
						<input
							id="propertyName"
							name="propertyName"
							type="text"
							required
							placeholder="e.g. Casa Amelia, Mountain Cabin, Studio 42"
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="city" className={labelClass}>
								City <span className="text-wale-800 font-bold">*</span>
							</label>
							<input
								id="city"
								name="city"
								type="text"
								required
								placeholder="e.g. Zakopane"
								className={inputClass}
							/>
						</div>
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="country" className={labelClass}>
								Country <span className="text-wale-800 font-bold">*</span>
							</label>
							<input
								id="country"
								name="country"
								type="text"
								required
								placeholder="e.g. Poland"
								className={inputClass}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="propertyType" className={labelClass}>
								Property type <span className="text-wale-800 font-bold">*</span>
							</label>
							<select
								id="propertyType"
								name="propertyType"
								required
								defaultValue=""
								className={inputClass}
							>
								<option value="" disabled>
									Choose type
								</option>
								{PROPERTY_TYPES.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
						</div>
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="guestCapacity" className={labelClass}>
								Fits how many guests? <span className="text-wale-800 font-bold">*</span>
							</label>
							<select
								id="guestCapacity"
								name="guestCapacity"
								required
								defaultValue=""
								className={inputClass}
							>
								<option value="" disabled>
									Choose capacity
								</option>
								{GUEST_CAPACITIES.map((capacity) => (
									<option key={capacity} value={capacity}>
										{capacity}
									</option>
								))}
							</select>
						</div>
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="bedrooms" className={labelClass}>
								Bedrooms <span className="text-wale-800 font-bold">*</span>
							</label>
							<select id="bedrooms" name="bedrooms" required defaultValue="" className={inputClass}>
								<option value="" disabled>
									Choose
								</option>
								{BEDROOM_COUNTS.map((count) => (
									<option key={count} value={count}>
										{count}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader
						number={3}
						title="Is it work-ready?"
						subtext="Check all that apply — this helps us understand fit."
					/>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{WORK_READY_OPTIONS.map((option) => (
							<label key={option.value} className="flex cursor-pointer items-center gap-3">
								<input
									type="checkbox"
									name="workReady"
									value={option.value}
									className="peer sr-only"
								/>
								<span className="border-wale-700/30 peer-checked:border-wale-700 peer-checked:bg-wale-700 flex size-5 shrink-0 items-center justify-center rounded border bg-white text-transparent peer-checked:text-white">
									✓
								</span>
								<span className="text-wale-800 text-sm">{option.label}</span>
							</label>
						))}
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="workReadyOther" className={labelClass}>
							Anything else? (optional)
						</label>
						<input
							id="workReadyOther"
							name="workReadyOther"
							type="text"
							placeholder="e.g. Standing desk, outdoor covered workspace, second monitor available"
							className={inputClass}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader number={4} title="When is it available?" />
					<div className="flex flex-wrap gap-2">
						{AVAILABILITY_OPTIONS.map((option, index) => (
							<label key={option} className="cursor-pointer">
								<input
									type="radio"
									name="availability"
									value={option}
									defaultChecked={index === 0}
									className="peer sr-only"
								/>
								<span className="peer-checked:bg-wale-700 border-wale-700/15 text-wale-800 inline-flex items-center rounded-full border bg-white px-5 py-2.5 text-sm font-medium transition-colors peer-checked:text-white">
									{option}
								</span>
							</label>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader
						number={5}
						title="Currently listed elsewhere?"
						subtext="Optional — helps us understand your setup."
					/>
					<div className="flex flex-col gap-2">
						<label htmlFor="airbnbUrl" className={labelClass}>
							Airbnb URL
						</label>
						<input
							id="airbnbUrl"
							name="airbnbUrl"
							type="url"
							placeholder="https://airbnb.com/..."
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="bookingUrl" className={labelClass}>
							Booking.com URL
						</label>
						<input
							id="bookingUrl"
							name="bookingUrl"
							type="url"
							placeholder="https://booking.com/..."
							className={inputClass}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader
						number={6}
						title="What makes your space special?"
						subtext="Optional but it's your chance to tell your story."
					/>
					<textarea
						name="spaceStory"
						rows={4}
						placeholder="Share what makes your property unique — the view, the community, the vibe, the history, why remote workers would love it here..."
						className={textareaClass}
					/>
				</div>

				<div className="flex flex-col gap-5">
					<ConsentCheckbox label="Privacy Policy" />

					{status === "error" && (
						<p className="text-sm text-red-600">
							Something went wrong sending your application. Please try again, or email us directly.
						</p>
					)}

					<button
						type="submit"
						disabled={status === "sending"}
						className="bg-wale-700 font-display hover:bg-wale-800 inline-flex w-fit items-center gap-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl px-12 py-5 text-base font-medium tracking-[0.08px] text-white disabled:opacity-50"
					>
						{status === "sending" ? "Sending…" : "Apply as founding host"}
						<span aria-hidden="true">→</span>
					</button>
					<p className="text-wale-800/55 text-sm">
						Founding host applications are reviewed personally. Response within a few days.
					</p>
				</div>
			</form>
		</>
	);
}
