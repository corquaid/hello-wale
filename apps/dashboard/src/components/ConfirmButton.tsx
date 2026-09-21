"use client";

import { useActionState, useEffect, useRef, type ReactNode, type RefObject } from "react";

/** What a confirmed action reports back: nothing on success, or why not. */
export type ConfirmState = { error: string } | undefined;

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
	fields,
	children,
}: {
	/**
	 * The Server Action to run once confirmed, already bound to its arguments.
	 * Returning an error keeps the dialog open and shows it; an action that
	 * redirects never returns at all.
	 */
	action: (prevState: ConfirmState, formData: FormData) => Promise<ConfirmState>;
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
	/**
	 * Inputs shown inside the dialog, for an action that needs something said
	 * before it runs — a reason, most often. They submit with the form.
	 */
	fields?: ReactNode;
	/** Hidden inputs the action needs. */
	children?: ReactNode;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [state, formAction, pending] = useActionState(action, undefined);

	const trigger = triggerClassName ?? "text-sm text-red-600 hover:text-red-800";

	return (
		<form action={formAction}>
			{children}

			<button type="button" onClick={() => dialogRef.current?.showModal()} className={trigger}>
				{label}
			</button>

			<ConfirmDialog
				dialogRef={dialogRef}
				title={title}
				description={description}
				fields={fields}
				confirmLabel={confirmLabel ?? label}
				pendingLabel={pendingLabel ?? "Working…"}
				tone={tone}
				state={state}
				pending={pending}
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
	fields,
	confirmLabel,
	pendingLabel,
	tone,
	state,
	pending,
}: {
	dialogRef: RefObject<HTMLDialogElement | null>;
	title: string;
	description?: ReactNode;
	fields?: ReactNode;
	confirmLabel: string;
	pendingLabel: string;
	tone: "danger" | "primary";
	state: ConfirmState;
	pending: boolean;
}) {
	/*
	 * Close once the submission finishes.
	 *
	 * An action that redirects takes the dialog with it when the page changes,
	 * which is why the deactivations never needed this. One that only
	 * revalidates — a reversal, say — leaves the page in place, and the dialog
	 * would sit there over freshly updated content as if nothing had happened.
	 *
	 * A refusal keeps it open, because the message belongs next to the button
	 * that caused it — closing would hide the only explanation.
	 */
	const wasPending = useRef(false);

	useEffect(() => {
		if (wasPending.current && !pending && !state?.error) dialogRef.current?.close();
		wasPending.current = pending;
	}, [pending, state, dialogRef]);

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
			/*
			 * `whitespace-normal` and `text-left` are not decoration: a modal
			 * <dialog> paints in the top layer but stays a DOM descendant of
			 * whatever opened it, so it inherits that element's text styles. Opened
			 * from a table cell with `whitespace-nowrap`, the copy refuses to wrap
			 * and the panel scrolls sideways. These reset it wherever it is used.
			 */
			className="fixed inset-0 m-auto h-fit max-h-[calc(100dvh-4rem)] w-[calc(100%-2rem)] max-w-md overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-gray-200 bg-white p-0 text-left whitespace-normal shadow-xl"
		>
			{/*
			 * `break-words` throughout: titles carry names and descriptions carry
			 * email addresses, neither of which the app controls, and one long
			 * unbroken string would otherwise push the panel wider than the
			 * screen. The buttons stack on a narrow one, confirm on top, so the
			 * safe choice stays under the thumb.
			 */}
			<div className="p-6">
				<h2
					id="confirm-title"
					className="font-display text-lg font-medium break-words text-gray-900"
				>
					{title}
				</h2>

				{description && <div className="mt-2 text-sm break-words text-gray-600">{description}</div>}

				{fields && <div className="mt-4 space-y-4">{fields}</div>}

				{state?.error && <p className="mt-4 text-sm text-red-600">{state.error}</p>}

				<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<CancelButton onCancel={() => dialogRef.current?.close()} pending={pending} />
					<ConfirmSubmit
						label={confirmLabel}
						pendingLabel={pendingLabel}
						tone={tone}
						pending={pending}
					/>
				</div>
			</div>
		</dialog>
	);
}

function CancelButton({ onCancel, pending }: { onCancel: () => void; pending: boolean }) {
	return (
		<button
			type="button"
			onClick={onCancel}
			disabled={pending}
			className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
		>
			Cancel
		</button>
	);
}

function ConfirmSubmit({
	label,
	pendingLabel,
	tone,
	pending,
}: {
	label: string;
	pendingLabel: string;
	tone: "danger" | "primary";
	pending: boolean;
}) {
	const styles =
		tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-wale-700 hover:bg-wale-800";

	return (
		<button
			type="submit"
			disabled={pending}
			className={`w-full rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50 sm:w-auto ${styles}`}
		>
			{pending ? pendingLabel : label}
		</button>
	);
}
