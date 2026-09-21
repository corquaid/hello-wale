import { AcceptInvitationForm } from "./AcceptInvitationForm";

/**
 * Where an invitation email lands.
 *
 * Public: the recipient has no account yet, and the token in the path is the
 * credential — see the rule for /invitations/ in src/proxy.ts.
 *
 * The screen cannot say who invited them or which company they are joining.
 * The only route that reads an invitation is company-scoped and needs a
 * session, which is exactly what somebody arriving here does not have. The API
 * would need a public lookup for the token to show any of it.
 */
export default async function AcceptInvitationPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;

	return <AcceptInvitationForm token={token} />;
}
