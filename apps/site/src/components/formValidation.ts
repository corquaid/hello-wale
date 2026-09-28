import type { FormValidationCopy } from "../i18n/types";

// Forms validate in JS (with `noValidate` on the <form>) rather than through
// the browser's built-in checks, so the messages come from the dictionary in
// the page's language instead of the browser's.

export type FieldErrors = Partial<Record<string, string>>;

// The copy docs left these as "xx" — adjust here; the messages pick them up.
export const LIMITS = {
	name: { min: 2, max: 80 },
	companyName: { min: 2, max: 100 },
	propertyName: { min: 2, max: 100 },
	shortText: { max: 100 },
	teamSizeDigits: 6,
	freeText: { max: 2000 },
	// Polish numbers are exactly 9 digits; other countries vary.
	polishPhoneDigits: 9,
	phoneDigits: { min: 6, max: 15 },
};

// Any script's letters (so "José" or "Müller" pass), plus the space, hyphen,
// apostrophe and full stop that names use.
const LETTERS = /^[\p{L}\s'’.-]+$/u;
const EMAIL_CHARS = /^[A-Za-z0-9@._-]+$/;
const EMAIL_FORMAT = /^[^@]+@[^@.]+(\.[^@.]+)+$/;
const DIGITS = /^\d+$/;
const FREE_TEXT_DISALLOWED = /[<>{}[\]\\^`|~]/;

function fill(template: string, values: Record<string, number>) {
	return template.replace(/\{(\w+)\}/g, (match, key: string) =>
		key in values ? String(values[key]) : match,
	);
}

// Each check returns the first failing message, or undefined when valid.
// An empty optional field is always valid.

export function checkName(
	value: string,
	copy: FormValidationCopy,
	requiredMessage: string,
): string | undefined {
	if (!value) return requiredMessage;
	if (!LETTERS.test(value)) return copy.lettersOnly;
	return checkLength(value, LIMITS.name, copy);
}

export function checkEmail(
	value: string,
	copy: FormValidationCopy,
	requiredMessage: string,
): string | undefined {
	if (!value) return requiredMessage;
	if (!EMAIL_CHARS.test(value)) return copy.emailChars;
	if (!EMAIL_FORMAT.test(value)) return copy.emailInvalid;
	return undefined;
}

export function checkPhone(
	code: string,
	number: string,
	copy: FormValidationCopy,
	requiredMessage?: string,
): string | undefined {
	const digits = number.replace(/\s+/g, "");
	if (!digits) return requiredMessage;
	if (!DIGITS.test(digits)) return copy.digitsOnly;
	if (code === "+48") {
		return digits.length === LIMITS.polishPhoneDigits
			? undefined
			: fill(copy.phoneDigits, { digits: LIMITS.polishPhoneDigits });
	}
	const { min, max } = LIMITS.phoneDigits;
	return digits.length >= min && digits.length <= max
		? undefined
		: fill(copy.phoneDigitsRange, { min, max });
}

export function checkLength(
	value: string,
	limits: { min?: number; max: number },
	copy: FormValidationCopy,
): string | undefined {
	if (limits.min !== undefined && value.length < limits.min) {
		return fill(copy.tooShort, { min: limits.min });
	}
	if (value.length > limits.max) return fill(copy.tooLong, { max: limits.max });
	return undefined;
}

export function checkText(
	value: string,
	limits: { min?: number; max: number },
	copy: FormValidationCopy,
	requiredMessage?: string,
): string | undefined {
	if (!value) return requiredMessage;
	return checkLength(value, limits, copy);
}

export function checkFreeText(
	value: string,
	copy: FormValidationCopy,
	requiredMessage?: string,
): string | undefined {
	if (!value) return requiredMessage;
	if (FREE_TEXT_DISALLOWED.test(value)) return copy.freeTextChars;
	return checkLength(value, LIMITS.freeText, copy);
}

export function checkDigits(
	value: string,
	maxDigits: number,
	copy: FormValidationCopy,
	requiredMessage: string,
): string | undefined {
	if (!value) return requiredMessage;
	if (!DIGITS.test(value)) return copy.digitsOnly;
	if (value.length > maxDigits) return fill(copy.tooManyDigits, { max: maxDigits });
	return undefined;
}

export function checkUrl(value: string, copy: FormValidationCopy): string | undefined {
	if (!value) return undefined;
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:" ? undefined : copy.urlInvalid;
	} catch {
		return copy.urlInvalid;
	}
}

export function collectErrors(checks: Record<string, string | undefined>): FieldErrors {
	return Object.fromEntries(
		Object.entries(checks).filter((entry): entry is [string, string] => entry[1] !== undefined),
	);
}

// Moves focus to the first field (in DOM order) that has an error.
export function focusFirstError(form: HTMLFormElement, errors: FieldErrors) {
	const firstInvalid = Array.from(form.elements).find(
		(element): element is HTMLElement =>
			element instanceof HTMLElement && "name" in element && Boolean(errors[String(element.name)]),
	);
	firstInvalid?.focus();
}
