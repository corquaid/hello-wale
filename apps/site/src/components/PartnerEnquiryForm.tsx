import { useState } from "react";
import wellbeingIcon from "../assets/images/partner-intent-wellbeing.png";
import retreatsIcon from "../assets/images/partner-intent-retreats.png";
import individualIcon from "../assets/images/partner-intent-individual.png";
import curiousIcon from "../assets/images/partner-intent-curious.png";
import applicationSentIcon from "../assets/images/partner-application-sent.png";
import SentModal from "./SentModal";
import type { PartnerEnquiryFormCopy, PartnerIntentKey } from "../i18n/types";
import {
	checkDigits,
	checkEmail,
	checkFreeText,
	checkName,
	checkPhone,
	checkText,
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

// `id` is the value submitted to HubSpot's partner_intent property, so it
// stays fixed across locales; the visible title/description come from `copy`.
const INTENTS: { id: PartnerIntentKey; icon: string }[] = [
	{ id: "wellbeing", icon: wellbeingIcon.src },
	{ id: "retreats", icon: retreatsIcon.src },
	{ id: "individual", icon: individualIcon.src },
	{ id: "curious", icon: curiousIcon.src },
];

interface Props {
	copy: PartnerEnquiryFormCopy;
	blogHref: string;
}

export default function PartnerEnquiryForm({ copy, blogHref }: Props) {
	const [status, setStatus] = useState<"idle" | "sending" | "submitted" | "error">("idle");
	const [showModal, setShowModal] = useState(false);
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

		// Rules and messages follow the "Walidacje formularza" table in the
		// companies apply-form copy doc.
		const { validation, required } = copy;
		const fieldErrors = collectErrors({
			fullName: checkName(fullName, validation, required.fullName),
			workEmail: checkEmail(workEmail, validation, required.workEmail),
			phoneNumber: checkPhone(phoneCode, phoneNumber, validation, required.phone),
			jobTitle: checkText(jobTitle, LIMITS.shortText, validation),
			companyName: checkText(companyName, LIMITS.companyName, validation, required.companyName),
			teamSize: checkDigits(teamSize, LIMITS.teamSizeDigits, validation, required.teamSize),
			country: checkText(country, LIMITS.shortText, validation, required.country),
			intents: intents.length > 0 ? undefined : required.intents,
			message: checkFreeText(message, validation),
			consent: consented ? undefined : validation.consentRequired,
		});
		setErrors(fieldErrors);
		if (Object.keys(fieldErrors).length > 0) {
			focusFirstError(form, fieldErrors);
			return;
		}

		setStatus("sending");

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
								text: consentText(copy),
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
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="flex flex-1 flex-col gap-2">
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
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="workEmail" className={labelClass}>
								{copy.fields.workEmail.label} <span className="text-wale-800 font-bold">*</span>
							</label>
							<input
								id="workEmail"
								name="workEmail"
								{...errorProps(errors, "workEmail")}
								type="email"
								required
								placeholder={copy.fields.workEmail.placeholder}
								className={inputClass}
							/>
							<FieldError errors={errors} name="workEmail" />
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="phoneNumber" className={labelClass}>
							{copy.phoneNumber} <span className="text-wale-800 font-bold">*</span>
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
								required
								type="tel"
								placeholder="600 123 456"
								className={`${inputClass} flex-1`}
							/>
						</div>
						<FieldError errors={errors} name="phoneNumber" />
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="jobTitle" className={labelClass}>
							{copy.fields.jobTitle.label}
						</label>
						<input
							id="jobTitle"
							name="jobTitle"
							{...errorProps(errors, "jobTitle")}
							type="text"
							placeholder={copy.fields.jobTitle.placeholder}
							className={inputClass}
						/>
						<FieldError errors={errors} name="jobTitle" />
					</div>
				</div>

				<div className="flex flex-col gap-6">
					<SectionHeader number={2} title={copy.sections.aboutCompany} />
					<div className="flex flex-col gap-2">
						<label htmlFor="companyName" className={labelClass}>
							{copy.fields.companyName.label} <span className="text-wale-800 font-bold">*</span>
						</label>
						<input
							id="companyName"
							name="companyName"
							{...errorProps(errors, "companyName")}
							type="text"
							required
							placeholder={copy.fields.companyName.placeholder}
							className={inputClass}
						/>
						<FieldError errors={errors} name="companyName" />
					</div>
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="flex flex-1 flex-col gap-2">
							<label htmlFor="teamSize" className={labelClass}>
								{copy.fields.teamSize.label} <span className="text-wale-800 font-bold">*</span>
							</label>
							<input
								id="teamSize"
								name="teamSize"
								{...errorProps(errors, "teamSize")}
								type="text"
								inputMode="numeric"
								required
								placeholder={copy.fields.teamSize.placeholder}
								className={inputClass}
							/>
							<FieldError errors={errors} name="teamSize" />
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
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader
						number={3}
						title={copy.sections.intents}
						subtext={copy.sections.intentsSubtext}
					/>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{INTENTS.map((intent) => (
							<label
								key={intent.id}
								className="has-checked:bg-wale-700 has-checked:border-wale-700 border-wale-700/15 flex cursor-pointer flex-col gap-2 rounded-xl border bg-white p-5 transition-colors duration-200"
							>
								<input
									type="checkbox"
									name="intents"
									value={intent.id}
									className="peer sr-only"
									{...errorProps(errors, "intents")}
								/>
								<span className="bg-wale-50 peer-checked:bg-wale-peach flex size-10 items-center justify-center rounded-full transition-colors duration-200">
									<img src={intent.icon} alt="" className="size-7 rounded-full" />
								</span>
								<span className="font-display text-wale-800 text-sm font-bold transition-colors duration-200 peer-checked:text-white">
									{copy.intents[intent.id].title}
								</span>
								<span className="text-wale-800/60 peer-checked:text-wale-peach text-xs leading-relaxed transition-colors duration-200">
									{copy.intents[intent.id].description}
								</span>
							</label>
						))}
					</div>
					<FieldError errors={errors} name="intents" />
				</div>

				<div className="flex flex-col gap-4">
					<SectionHeader
						number={4}
						title={copy.sections.message}
						subtext={copy.sections.messageSubtext}
					/>
					<textarea
						name="message"
						{...errorProps(errors, "message")}
						rows={5}
						placeholder={copy.fields.messagePlaceholder}
						className={textareaClass}
					/>
					<FieldError errors={errors} name="message" />
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
