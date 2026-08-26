import { useEffect, useRef } from "react";

interface Props {
	icon: string;
	title: string;
	body: string;
	closeLabel: string;
	closeButtonVariant?: "primary" | "peach";
	secondaryLabel: string;
	secondaryHref: string;
	onClose: () => void;
}

const closeButtonVariantClass = {
	primary: "bg-wale-700 hover:bg-wale-800 text-white",
	peach: "bg-wale-peach hover:bg-wale-cream text-wale-700",
};

export default function SentModal({
	icon,
	title,
	body,
	closeLabel,
	closeButtonVariant = "primary",
	secondaryLabel,
	secondaryHref,
	onClose,
}: Props) {
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		closeButtonRef.current?.focus();
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onClose();
		}
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b0e21]/55 px-4">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="sent-modal-title"
				className="relative flex w-full max-w-120 flex-col items-center gap-6 rounded-tl-4xl rounded-tr-4xl rounded-bl-4xl bg-white px-8 py-12 text-center shadow-[0px_16px_66px_rgba(26,10,20,0.12)] sm:px-14"
			>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					className="text-wale-800/50 hover:text-wale-800 absolute top-5 right-5"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						className="size-5"
					>
						<path d="M6 6l12 12M18 6L6 18" />
					</svg>
				</button>
				<img src={icon} alt="" className="size-37" />
				<p id="sent-modal-title" className="font-display text-wale-700 text-2xl font-bold">
					{title}
				</p>
				<p className="text-wale-800/70 text-sm leading-relaxed">{body}</p>
				<button
					ref={closeButtonRef}
					type="button"
					onClick={onClose}
					className={`font-display w-full rounded-tl-xl rounded-tr-xl rounded-bl-xl px-12 py-5 text-base font-medium tracking-[0.08px] ${closeButtonVariantClass[closeButtonVariant]}`}
				>
					{closeLabel}
				</button>
				<a
					href={secondaryHref}
					className="font-display text-wale-800/75 hover:text-wale-800 text-sm font-bold"
				>
					{secondaryLabel}
				</a>
			</div>
		</div>
	);
}
