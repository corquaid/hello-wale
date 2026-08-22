import { useState } from "react";
import wellbeingIcon from "../assets/images/partner-intent-wellbeing.png";
import retreatsIcon from "../assets/images/partner-intent-retreats.png";
import individualIcon from "../assets/images/partner-intent-individual.png";
import curiousIcon from "../assets/images/partner-intent-curious.png";

// HubSpot's Forms Submission API is public/CORS-enabled (no secret key), so
// it's called directly from the browser — see developers.hubspot.com's
// "Submit data to a form" (unauthenticated) endpoint. The portalId/formGuid
// pair only works because a matching form, with a field for every `name`
// used in `hubspotFields` below (email, firstname, lastname, phone, jobtitle,
// company, country, plus custom properties team_size / partner_intent /
// enquiry_message), already exists in the HubSpot account — fields not on
// the form are silently rejected, not stored blank.
const HUBSPOT_PORTAL_ID = import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID;
const HUBSPOT_FORM_GUID = import.meta.env.PUBLIC_HUBSPOT_PARTNER_FORM_GUID;

const PHONE_CODES = [
	{ code: "+48", label: "🇵🇱 +48" },
	{ code: "+44", label: "🇬🇧 +44" },
	{ code: "+49", label: "🇩🇪 +49" },
	{ code: "+33", label: "🇫🇷 +33" },
	{ code: "+420", label: "🇨🇿 +420" },
	{ code: "+1", label: "🇺🇸 +1" },
];

const INTENTS = [
	{
		id: "wellbeing",
		title: "Wellbeing benefit",
		description: "For the whole team, year-round.",
		icon: wellbeingIcon.src,
	},
	{
		id: "retreats",
		title: "Team retreats",
		description: "Offsites, planning weeks, resets.",
		icon: retreatsIcon.src,
	},
	{
		id: "individual",
		title: "Individual perk",
		description: "Workation as a personal benefit.",
		icon: individualIcon.src,
	},
	{
		id: "curious",
		title: "Just curious",
		description: "Exploring — not sure yet.",
		icon: curiousIcon.src,
	},
];

const inputClass =
	"w-full rounded-lg border border-wale-700/15 bg-white px-6 py-5 text-sm text-wale-800 placeholder:text-wale-800/40 focus:outline-none focus:ring-2 focus:ring-wale-700/30";
const labelClass = "flex items-center gap-1 text-sm font-medium text-wale-800/80";

function SectionHeader({
	number,
	title,
	subtext,
}: {
	number: number;
	title: string;
	subtext?: string;
}) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-3">
				<span className="bg-wale-700 text-wale-gold flex size-7.5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
					{number}
				</span>
				<p className="font-display text-wale-800 text-lg font-bold tracking-[-0.036px]">{title}</p>
			</div>
			{subtext && <p className="text-wale-800/60 text-sm leading-relaxed">{subtext}</p>}
		</div>
	);
}

export default function PartnerEnquiryForm() {
	const [status, setStatus] = useState<"idle" | "sending" | "submitted" | "error">("idle");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatus("sending");

		const form = event.currentTarget;
		const data = new FormData(form);

		const fullName = String(data.get("fullName") ?? "").trim();
		const [firstName, ...rest] = fullName.split(" ");
		const lastName = rest.join(" ");
		const workEmail = String(data.get("workEmail") ?? "").trim();
		const phoneCode = String(data.get("phoneCode") ?? "");
		const phoneNumber = String(data.get("phoneNumber") ?? "").trim();
		const phone = phoneNumber ? `${phoneCode}${phoneNumber.replace(/\s+/g, "")}` : "";
		const jobTitle = String(data.get("jobTitle") ?? "").trim();
		const companyName = String(data.get("companyName") ?? "").trim();
		const teamSize = String(data.get("teamSize") ?? "").trim();
		const country = String(data.get("country") ?? "").trim();
		const intents = data.getAll("intents").map(String);
		const message = String(data.get("message") ?? "").trim();
		const consented = data.get("consent") === "on";

		const hubspotFields = [
			{ objectTypeId: "0-1", name: "email", value: workEmail },
			{ objectTypeId: "0-1", name: "firstname", value: firstName ?? "" },
			{ objectTypeId: "0-1", name: "lastname", value: lastName },
			{ objectTypeId: "0-1", name: "phone", value: phone },
			{ objectTypeId: "0-1", name: "jobtitle", value: jobTitle },
			{ objectTypeId: "0-1", name: "company", value: companyName },
			{ objectTypeId: "0-1", name: "country", value: country },
			{ objectTypeId: "0-1", name: "team_size", value: teamSize },
			{ objectTypeId: "0-1", name: "partner_intent", value: intents.join(";") },
			{ objectTypeId: "0-1", name: "enquiry_message", value: message },
		].filter((field) => field.value !== "");

		if (!HUBSPOT_PORTAL_ID || !HUBSPOT_FORM_GUID) {
			console.error(
				"HubSpot is not configured: missing PUBLIC_HUBSPOT_PORTAL_ID / PUBLIC_HUBSPOT_PARTNER_FORM_GUID",
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
				// HubSpot's common rejection reasons — a field missing from the form,
				// a checkbox value not in partner_intent's option list, or a bad
				// email — surface as `category`/`errors[].errorType` here, worth
				// keeping in the console since the visible error message stays generic.
				console.error("HubSpot submission failed:", response.status, errorBody);
				throw new Error("HubSpot submission failed");
			}
			setStatus("submitted");
		} catch (error) {
			console.error("HubSpot submission failed:", error);
			setStatus("error");
		}
	}

	if (status === "submitted") {
		return (
			<div className="border-wale-700/15 rounded-xl border bg-white px-8 py-12 text-center">
				<p className="font-display text-wale-800 text-xl font-bold">Thanks for reaching out!</p>
				<p className="text-wale-800/65 mt-2 text-sm">
					We've got your enquiry — we'll respond within 48 hours. No sales pressure promise.
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-10">
			<div className="flex flex-col gap-4">
				<SectionHeader number={1} title="About you" />
				<div className="flex flex-col gap-4 sm:flex-row">
					<div className="flex flex-1 flex-col gap-2">
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
					<div className="flex flex-1 flex-col gap-2">
						<label htmlFor="workEmail" className={labelClass}>
							Work email <span className="text-wale-800 font-bold">*</span>
						</label>
						<input
							id="workEmail"
							name="workEmail"
							type="email"
							required
							placeholder="you@company.com"
							className={inputClass}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="phoneNumber" className={labelClass}>
						Phone Number
					</label>
					<div className="flex gap-1">
						<select
							id="phoneCode"
							name="phoneCode"
							defaultValue="+48"
							aria-label="Country calling code"
							className="text-wale-800 focus:ring-wale-700/30 rounded-lg border border-wale-700/15 bg-white px-3 py-5 text-sm focus:ring-2 focus:outline-none"
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
				<div className="flex flex-col gap-2">
					<label htmlFor="jobTitle" className={labelClass}>
						Job title
					</label>
					<input
						id="jobTitle"
						name="jobTitle"
						type="text"
						placeholder="e.g. Head of People, Founder, HR Manager"
						className={inputClass}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<SectionHeader number={2} title="About your company" />
				<div className="flex flex-col gap-2">
					<label htmlFor="companyName" className={labelClass}>
						Company name <span className="text-wale-800 font-bold">*</span>
					</label>
					<input
						id="companyName"
						name="companyName"
						type="text"
						required
						placeholder="e.g. Green Studio"
						className={inputClass}
					/>
				</div>
				<div className="flex flex-col gap-4 sm:flex-row">
					<div className="flex flex-1 flex-col gap-2">
						<label htmlFor="teamSize" className={labelClass}>
							Team size <span className="text-wale-800 font-bold">*</span>
						</label>
						<input
							id="teamSize"
							name="teamSize"
							type="number"
							min={1}
							required
							placeholder="Write number"
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
			</div>

			<div className="flex flex-col gap-4">
				<SectionHeader number={3} title="What brings you here?" subtext="Choose one or more." />
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{INTENTS.map((intent) => (
						<label
							key={intent.id}
							className="has-checked:bg-wale-700 has-checked:border-wale-700 flex cursor-pointer flex-col gap-2 rounded-xl border border-wale-700/15 bg-white p-5 transition-colors duration-200"
						>
							<input type="checkbox" name="intents" value={intent.id} className="peer sr-only" />
							<span className="bg-wale-50 peer-checked:bg-wale-peach flex size-10 items-center justify-center rounded-full transition-colors duration-200">
								<img src={intent.icon} alt="" className="size-7 rounded-full" />
							</span>
							<span className="font-display text-wale-800 text-sm font-bold transition-colors duration-200 peer-checked:text-white">
								{intent.title}
							</span>
							<span className="text-wale-800/60 peer-checked:text-wale-peach text-xs leading-relaxed transition-colors duration-200">
								{intent.description}
							</span>
						</label>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<SectionHeader
					number={4}
					title="Anything else we should know?"
					subtext="Optional but helpful for our first call."
				/>
				<textarea
					name="message"
					rows={5}
					placeholder="Tell us what you're hoping HelloWale can do for your team, any specific stays you have in mind, or questions you'd like answered..."
					className="text-wale-800 placeholder:text-wale-800/40 focus:ring-wale-700/30 w-full rounded-lg border border-wale-700/15 bg-white p-4 text-sm focus:ring-2 focus:outline-none"
				/>
			</div>

			<div className="flex flex-col gap-5">
				<label className="flex cursor-pointer items-center gap-3">
					<input type="checkbox" name="consent" required className="peer sr-only" />
					<span className="border-wale-700/30 peer-checked:border-wale-700 peer-checked:bg-wale-700 flex size-5 shrink-0 items-center justify-center rounded border bg-white text-transparent peer-checked:text-white">
						✓
					</span>
					<span className="text-wale-800/70 text-sm">
						I've read and agree to the{" "}
						<span className="text-wale-800 font-bold">Privacy Policy</span>.
					</span>
				</label>

				{status === "error" && (
					<p className="text-sm text-red-600">
						Something went wrong sending your enquiry. Please try again, or email us directly.
					</p>
				)}

				<button
					type="submit"
					disabled={status === "sending"}
					className="bg-wale-700 font-display hover:bg-wale-800 inline-flex w-fit items-center gap-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl px-12 py-5 text-base font-medium tracking-[0.08px] text-white disabled:opacity-50"
				>
					{status === "sending" ? "Sending…" : "Partner with us"}
					<span aria-hidden="true">→</span>
				</button>
				<p className="text-wale-800/55 text-sm">
					We'll respond within 48 hours. No sales pressure promise.
				</p>
			</div>
		</form>
	);
}
