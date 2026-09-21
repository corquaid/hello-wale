"use client";

import { useActionState, useState } from "react";
import { grantPointsInBulk } from "../actions";
import type { GrantState } from "../actions";

export interface Recipient {
	id: number;
	name: string;
	email: string;
	balance: number;
}

/**
 * Hands points to several employees in one operation.
 *
 * The idempotency key follows the rule the other point forms use: it belongs
 * to a filled-in form rather than an attempt, so a double-submit collapses
 * into one grant. Clearing the fields after a success is a remount, keyed on
 * the new key — a rejected submission keeps what was typed, which matters more
 * here than anywhere else in the app, since it may be dozens of amounts.
 */
export function BulkGrantForm({
	recipients,
	poolBalance,
	initialIdempotencyKey,
}: {
	recipients: Recipient[];
	poolBalance: number;
	initialIdempotencyKey: string;
}) {
	const [state, formAction, pending] = useActionState(grantPointsInBulk, undefined);

	return (
		<BulkGrantFields
			key={state && "ok" in state ? state.nextKey : "pristine"}
			recipients={recipients}
			poolBalance={poolBalance}
			idempotencyKey={state?.nextKey ?? initialIdempotencyKey}
			state={state}
			formAction={formAction}
			pending={pending}
		/>
	);
}

function BulkGrantFields({
	recipients,
	poolBalance,
	idempotencyKey,
	state,
	formAction,
	pending,
}: {
	recipients: Recipient[];
	poolBalance: number;
	idempotencyKey: string;
	state: GrantState;
	formAction: (formData: FormData) => void;
	pending: boolean;
}) {
	const [amounts, setAmounts] = useState<Record<number, string>>({});
	const [everyone, setEveryone] = useState("");

	const entries = recipients
		.map((recipient) => ({ recipient, points: Number(amounts[recipient.id] ?? "") }))
		.filter((entry) => Number.isFinite(entry.points) && entry.points > 0);

	const total = entries.reduce((sum, entry) => sum + entry.points, 0);
	const overdrawn = total > poolBalance;

	const field =
		"focus:border-wale-700 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none";

	return (
		<form action={formAction} className="space-y-6">
			<input type="hidden" name="idempotency_key" value={idempotencyKey} />

			<div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
				<div className="space-y-1">
					<label htmlFor="everyone" className="block text-sm font-medium text-gray-700">
						Add common amount
					</label>
					<input
						id="everyone"
						type="number"
						step="1"
						min="1"
						value={everyone}
						onChange={(event) => setEveryone(event.target.value)}
						placeholder="e.g. 100"
						className={`${field} w-40`}
					/>
				</div>
				<button
					type="button"
					onClick={() => setAmounts(Object.fromEntries(recipients.map((r) => [r.id, everyone])))}
					className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					Apply to all
				</button>
				<button
					type="button"
					onClick={() => setAmounts({})}
					className="hover:text-wale-700 px-2 py-2 text-sm font-medium text-gray-500"
				>
					Clear all
				</button>
			</div>

			<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
				<table className="w-full text-left text-sm">
					<thead className="bg-gray-50 text-gray-500">
						<tr>
							<th className="px-4 py-3 font-medium">Employee</th>
							<th className="px-4 py-3 font-medium">Balance</th>
							<th className="px-4 py-3 font-medium">Points to grant</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{recipients.map((recipient) => (
							<tr key={recipient.id} className="hover:bg-gray-50">
								<td className="px-4 py-3">
									<span className="font-medium text-gray-900">{recipient.name}</span>
									<span className="block text-xs text-gray-500">{recipient.email}</span>
								</td>
								<td className="px-4 py-3 text-gray-600">{recipient.balance.toLocaleString()}</td>
								<td className="px-4 py-3">
									<input
										name={`points_${recipient.id}`}
										type="number"
										step="1"
										min="1"
										value={amounts[recipient.id] ?? ""}
										onChange={(event) =>
											setAmounts((current) => ({ ...current, [recipient.id]: event.target.value }))
										}
										aria-label={`Points for ${recipient.name}`}
										className={`${field} w-32`}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="space-y-1">
				<label htmlFor="reason_note" className="block text-sm font-medium text-gray-700">
					Reason <span className="font-normal text-gray-400">(optional)</span>
				</label>
				<input
					id="reason_note"
					name="reason_note"
					maxLength={500}
					placeholder="e.g. Q3 recognition"
					className={`${field} w-full`}
				/>
				<p className="text-xs text-gray-500">The same note is recorded against every allocation.</p>
			</div>

			<div className="rounded-lg border border-gray-200 bg-white p-4">
				<p className="text-sm text-gray-600">
					<span className="font-medium text-gray-900">{entries.length}</span>{" "}
					{entries.length === 1 ? "employee" : "employees"} ·{" "}
					<span className="font-medium text-gray-900">{total.toLocaleString()}</span> points · pool
					holds {poolBalance.toLocaleString()}
				</p>
				{overdrawn && (
					<p className="mt-1 text-sm text-red-600">
						That is more than the pool holds. The API refuses the whole grant rather than part of
						it, so nobody would receive anything.
					</p>
				)}
			</div>

			{state && "error" in state && <p className="text-sm text-red-600">{state.error}</p>}
			{state && "ok" in state && <p className="text-sm text-green-700">Points granted.</p>}

			<button
				type="submit"
				disabled={pending || entries.length === 0}
				className="bg-wale-700 hover:bg-wale-800 rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				{pending
					? "Granting…"
					: `Grant ${total.toLocaleString()} points to ${entries.length} ${
							entries.length === 1 ? "employee" : "employees"
						}`}
			</button>
		</form>
	);
}
