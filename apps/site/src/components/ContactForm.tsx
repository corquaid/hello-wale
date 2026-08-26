import { useState } from "react";

const CONTACT_API_URL = import.meta.env.PUBLIC_CONTACT_API_URL;

export default function ContactForm() {
	const [status, setStatus] = useState<"idle" | "sending" | "submitted" | "error">("idle");

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
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
			<div className="border-wale-700/20 bg-wale-50 rounded-lg border p-6 text-center">
				<p className="font-display text-wale-800 font-medium">Thanks for reaching out!</p>
				<p className="mt-1 text-sm text-slate-600">We'll get back to you shortly.</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div>
				<label htmlFor="name" className="text-wale-800 block text-sm font-medium">
					Name
				</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					className="focus:border-wale-700 mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none"
				/>
			</div>
			<div>
				<label htmlFor="email" className="text-wale-800 block text-sm font-medium">
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					className="focus:border-wale-700 mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none"
				/>
			</div>
			<div>
				<label htmlFor="message" className="text-wale-800 block text-sm font-medium">
					Message
				</label>
				<textarea
					id="message"
					name="message"
					rows={5}
					required
					className="focus:border-wale-700 mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none"
				/>
			</div>
			{status === "error" && (
				<p className="text-sm text-red-600">
					Something went wrong sending your message. Please try again.
				</p>
			)}
			<button
				type="submit"
				disabled={status === "sending"}
				className="bg-wale-700 font-display hover:bg-wale-800 rounded-tl-xl rounded-tr-xl rounded-bl-xl px-6 py-3.5 text-sm font-medium tracking-[0.14px] text-white disabled:opacity-50"
			>
				{status === "sending" ? "Sending…" : "Send message"}
			</button>
		</form>
	);
}
