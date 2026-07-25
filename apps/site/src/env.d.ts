/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	// URL of the contact form's backend endpoint (apps/dashboard's
	// /api/contact route). See src/components/ContactForm.tsx.
	readonly PUBLIC_CONTACT_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
