export const inputClass =
	"w-full rounded-lg border border-wale-700/15 bg-white px-6 py-5 text-sm text-wale-800 placeholder:text-wale-800/40 focus:outline-none focus:ring-2 focus:ring-wale-700/30";
export const labelClass = "flex items-center gap-1 text-sm font-medium text-wale-800/80";
export const textareaClass =
	"text-wale-800 placeholder:text-wale-800/40 focus:ring-wale-700/30 w-full rounded-lg border border-wale-700/15 bg-white p-4 text-sm focus:ring-2 focus:outline-none";

export function SectionHeader({
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

export function ConsentCheckbox({ label }: { label: string }) {
	return (
		<label className="flex cursor-pointer items-center gap-3">
			<input type="checkbox" name="consent" required className="peer sr-only" />
			<span className="border-wale-700/30 peer-checked:border-wale-700 peer-checked:bg-wale-700 flex size-5 shrink-0 items-center justify-center rounded border bg-white text-transparent peer-checked:text-white">
				✓
			</span>
			<span className="text-wale-800/70 text-sm">
				I've read and agree to the <span className="text-wale-800 font-bold">{label}</span>.
			</span>
		</label>
	);
}
