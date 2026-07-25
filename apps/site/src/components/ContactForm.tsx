import { useState } from "react";

export default function ContactForm() {
	const [status, setStatus] = useState<"idle" | "submitted">("idle");

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatus("submitted");
	}

	if (status === "submitted") {
		return (
			<div className="rounded-lg border border-slate-200 p-6 text-center">
				<p className="font-medium text-slate-900">Thanks for reaching out!</p>
				<p className="mt-1 text-sm text-slate-600">We'll get back to you shortly.</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div>
				<label htmlFor="name" className="block text-sm font-medium text-slate-900">
					Name
				</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
				/>
			</div>
			<div>
				<label htmlFor="email" className="block text-sm font-medium text-slate-900">
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
				/>
			</div>
			<div>
				<label htmlFor="message" className="block text-sm font-medium text-slate-900">
					Message
				</label>
				<textarea
					id="message"
					name="message"
					rows={5}
					required
					className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
				/>
			</div>
			<button
				type="submit"
				className="rounded-md bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-500"
			>
				Send message
			</button>
		</form>
	);
}
