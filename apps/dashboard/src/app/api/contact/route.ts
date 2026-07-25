import { NextResponse, type NextRequest } from "next/server";

// Public endpoint — called cross-origin from the marketing site (apps/site,
// static on GitHub Pages), which has no session cookie. Protected by the
// CORS allowlist and field validation below, not by proxy.ts / requireSession.
const ALLOWED_ORIGINS = [process.env.SITE_ORIGIN, "http://localhost:4321"].filter(
	(origin): origin is string => Boolean(origin),
);

function corsHeaders(origin: string | null) {
	const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
	return {
		"Access-Control-Allow-Origin": allowOrigin ?? "",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	};
}

export async function OPTIONS(request: NextRequest) {
	return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

export async function POST(request: NextRequest) {
	const headers = corsHeaders(request.headers.get("origin"));

	let body: { name?: string; email?: string; message?: string };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400, headers });
	}

	const name = body.name?.trim();
	const email = body.email?.trim();
	const message = body.message?.trim();

	if (!name || !email || !message) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers });
	}

	const apiKey = process.env.SENDGRID_API_KEY;
	const fromEmail = process.env.SENDGRID_FROM_EMAIL;
	const toEmail = process.env.CONTACT_TO_EMAIL;

	if (!apiKey || !fromEmail || !toEmail) {
		console.error("Contact form is not configured: missing SendGrid env vars");
		return NextResponse.json({ error: "Contact form is not available right now" }, { status: 503, headers });
	}

	const sendgridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			personalizations: [{ to: [{ email: toEmail }] }],
			from: { email: fromEmail, name: "HelloWale contact form" },
			reply_to: { email, name },
			subject: `New contact form message from ${name}`,
			content: [{ type: "text/plain", value: `Name: ${name}\nEmail: ${email}\n\n${message}` }],
		}),
	});

	if (!sendgridResponse.ok) {
		console.error("SendGrid error:", sendgridResponse.status, await sendgridResponse.text());
		return NextResponse.json({ error: "Failed to send message" }, { status: 502, headers });
	}

	return NextResponse.json({ ok: true }, { headers });
}
