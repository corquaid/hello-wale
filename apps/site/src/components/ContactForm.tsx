import { useState } from "react";
import type { ContactFormCopy } from "../i18n/types";
import { errorProps, FieldError } from "./formPrimitives";
import {
	checkEmail,
	checkFreeText,
	checkName,
	collectErrors,
	focusFirstError,
	type FieldErrors,
} from "./formValidation";

const CONTACT_API_URL = import.meta.env.PUBLIC_CONTACT_API_URL;

export default function ContactForm({ copy }: { copy: ContactFormCopy }) {
	const [status, setStatus] = useState<"idle" | "sending" | "submitted" | "error">("idle");
	const [errors, setErrors] = useState<FieldErrors>({});

	function clearError(event: React.FormEvent<HTMLFormElement>) {
		const name = (event.target as HTMLInputElement).name;
		if (errors[name]) setErrors(({ [name]: _cleared, ...rest }) => rest);
	}

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;
		const data = new FormData(form);

		const { validation, required } = copy;
		const fieldErrors = collectErrors({
			name: checkName(String(data.get("name") ?? "").trim(), validation, required.name),
			email: checkEmail(String(data.get("email") ?? "").trim(), validation, required.email),
			message: checkFreeText(
				String(data.get("message") ?? "").trim(),
				validation,
				required.message,
			),
		});
		setErrors(fieldErrors);
		if (Object.keys(fieldErrors).length > 0) {
			focusFirstError(form, fieldErrors);
			return;
		}

		setStatus("sending");

		try {
			const response = await fetch(CONTACT_API_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: data.get("name"),
					email: data.get("email"),
					message: data.get("message"),
				}),
			});

			if (!response.ok) throw new Error("Request failed");
			setStatus("submitted");
		} catch {
			setStatus("error");
		}
	}

	if (status === "submitted") {
		return (
			<div className="border-wale-700/20 bg-wale-50 rounded-lg border p-6 text-center">
				<p className="font-display text-wale-800 font-medium">{copy.successTitle}</p>
				<p className="mt-1 text-sm text-slate-600">{copy.successBody}</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} onInput={clearError} noValidate className="space-y-5">
			<div>
				<label htmlFor="name" className="text-wale-800 block text-sm font-medium">
					{copy.name}
				</label>
				<input
					id="name"
					name="name"
					{...errorProps(errors, "name")}
					type="text"
					required
					className="focus:border-wale-700 mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none aria-invalid:border-red-500"
				/>
				<FieldError errors={errors} name="name" />
			</div>
			<div>
				<label htmlFor="email" className="text-wale-800 block text-sm font-medium">
					{copy.email}
				</label>
				<input
					id="email"
					name="email"
					{...errorProps(errors, "email")}
					type="email"
					required
					className="focus:border-wale-700 mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none aria-invalid:border-red-500"
				/>
				<FieldError errors={errors} name="email" />
			</div>
			<div>
				<label htmlFor="message" className="text-wale-800 block text-sm font-medium">
					{copy.message}
				</label>
				<textarea
					id="message"
					name="message"
					{...errorProps(errors, "message")}
					rows={5}
					required
					className="focus:border-wale-700 mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none aria-invalid:border-red-500"
				/>
				<FieldError errors={errors} name="message" />
			</div>
			{status === "error" && <p className="text-sm text-red-600">{copy.error}</p>}
			<button
				type="submit"
				disabled={status === "sending"}
				className="bg-wale-700 font-display hover:bg-wale-800 rounded-tl-xl rounded-tr-xl rounded-bl-xl px-6 py-3.5 text-sm font-medium tracking-[0.14px] text-white disabled:opacity-50"
			>
				{status === "sending" ? copy.sending : copy.submit}
			</button>
		</form>
	);
}
