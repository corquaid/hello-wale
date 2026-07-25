import { useState } from "react";

const CONTACT_API_URL = import.meta.env.PUBLIC_CONTACT_API_URL;

export default function ContactForm() {
	const [status, setStatus] = useState<"idle" | "sending" | "submitted" | "error">("idle");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatus("sending");

		const form = event.currentTarget;
		const data = new FormData(form);

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
			<div className="rounded-lg border border-wale-700/20 bg-wale-50 p-6 text-center">
				<p className="font-display font-medium text-wale-800">Thanks for reaching out!</p>
				<p className="mt-1 text-sm text-slate-600">We'll get back to you shortly.</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div>
				<label htmlFor="name" className="block text-sm font-medium text-wale-800">
					Name
				</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-wale-700 focus:outline-none"
				/>
			</div>
			<div>
				<label htmlFor="email" className="block text-sm font-medium text-wale-800">
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-wale-700 focus:outline-none"
				/>
			</div>
			<div>
				<label htmlFor="message" className="block text-sm font-medium text-wale-800">
					Message
				</label>
				<textarea
					id="message"
					name="message"
					rows={5}
					required
					className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-wale-700 focus:outline-none"
				/>
			</div>
			{status === "error" && (
				<p className="text-sm text-red-600">Something went wrong sending your message. Please try again.</p>
			)}
			<button
				type="submit"
				disabled={status === "sending"}
				className="rounded-bl-xl rounded-tl-xl rounded-tr-xl bg-wale-700 px-6 py-3.5 font-display text-sm font-medium tracking-[0.14px] text-white hover:bg-wale-800 disabled:opacity-50"
			>
				{status === "sending" ? "Sending…" : "Send message"}
			</button>
		</form>
	);
}
