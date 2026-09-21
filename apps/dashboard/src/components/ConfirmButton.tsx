"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { useFormStatus } from "react-dom";

/**
 * A button that asks before it acts.
 *
 * Built on the native <dialog> rather than a div overlay: showModal() gives
 * the focus trap, the Escape key, the inert background and the ::backdrop for
 * free, all of which a hand-rolled modal has to reimplement and usually gets
 * wrong.
 *
 * The dialog sits *inside* the form, so the confirm button is an ordinary
 * submit and the Server Action receives whatever hidden inputs are passed as
 * children — an idempotency key, most often.
 */
export function ConfirmButton({
	action,
	label,
	title,
	description,
	confirmLabel,
	pendingLabel,
	tone = "danger",
	triggerClassName,
	children,
}: {
	/** The Server Action to run once confirmed, already bound to its arguments. */
	action: (formData: FormData) => void | Promise<void>;
	/** The trigger's text. */
	label: string;
	/** The question, as a question. */
	title: string;
	/** What the reader needs to know before answering it. */
	description?: ReactNode;
	confirmLabel?: string;
	pendingLabel?: string;
	tone?: "danger" | "primary";
	triggerClassName?: string;
	/** Hidden inputs the action needs. */
	children?: ReactNode;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const trigger = triggerClassName ?? "text-sm text-red-600 hover:text-red-800";

	return (
		<form action={action}>
			{children}

			<button type="button" onClick={() => dialogRef.current?.showModal()} className={trigger}>
				{label}
			</button>

			<ConfirmDialog
				dialogRef={dialogRef}
				title={title}
				description={description}
				confirmLabel={confirmLabel ?? label}
				pendingLabel={pendingLabel ?? "Working…"}
				tone={tone}
			/>
		</form>
	);
}

/**
 * Inside the form so it can read the form's status: once a submission is in
 * flight nothing dismisses the dialog — not the backdrop, not Escape, not
 * Cancel — because the request is already on its way and closing would suggest
 * otherwise.
 */
function ConfirmDialog({
	dialogRef,
	title,
	description,
	confirmLabel,
	pendingLabel,
	tone,
}: {
	dialogRef: RefObject<HTMLDialogElement | null>;
	title: string;
	description?: ReactNode;
	confirmLabel: string;
	pendingLabel: string;
	tone: "danger" | "primary";
}) {
	const { pending } = useFormStatus();

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby="confirm-title"
			/*
			 * A click lands on the <dialog> itself only when it misses the panel —
			 * the inner div covers the element entirely, which is why the padding
			 * lives there rather than here. That makes target === dialog a reliable
			 * test for "clicked the backdrop".
			 */
			onClick={(event) => {
				if (!pending && event.target === dialogRef.current) dialogRef.current?.close();
			}}
			onCancel={(event) => {
				if (pending) event.preventDefault();
			}}
			/*
			 * Centred explicitly: Preflight zeroes the margin a <dialog> relies on
			 * to centre itself, so `inset-0 m-auto` puts it back. `h-fit` keeps it
			 * the height of its content rather than stretching to the viewport.
			 */
			className="fixed inset-0 m-auto h-fit w-full max-w-md rounded-lg border border-gray-200 bg-white p-0 text-left shadow-xl"
		>
			<div className="p-6">
				<h2 id="confirm-title" className="font-display text-lg font-medium text-gray-900">
					{title}
				</h2>

				{description && <div className="mt-2 text-sm text-gray-600">{description}</div>}

				<div className="mt-6 flex justify-end gap-3">
					<CancelButton onCancel={() => dialogRef.current?.close()} />
					<ConfirmSubmit label={confirmLabel} pendingLabel={pendingLabel} tone={tone} />
				</div>
			</div>
		</dialog>
	);
}

function CancelButton({ onCancel }: { onCancel: () => void }) {
	const { pending } = useFormStatus();

	return (
		<button
			type="button"
			onClick={onCancel}
			disabled={pending}
			className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
		>
			Cancel
		</button>
	);
}

function ConfirmSubmit({
	label,
	pendingLabel,
	tone,
}: {
	label: string;
	pendingLabel: string;
	tone: "danger" | "primary";
}) {
	const { pending } = useFormStatus();

	const styles =
		tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-wale-700 hover:bg-wale-800";

	return (
		<button
			type="submit"
			disabled={pending}
			className={`rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50 ${styles}`}
		>
			{pending ? pendingLabel : label}
		</button>
	);
}
