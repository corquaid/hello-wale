"use client";

import { deleteCustomer } from "../actions";

export function DeleteCustomerButton({ customerId, name }: { customerId: string; name: string }) {
	return (
		<form
			action={deleteCustomer.bind(null, customerId)}
			onSubmit={(event) => {
				if (!confirm(`Delete ${name}? This also deletes their full points history.`)) {
					event.preventDefault();
				}
			}}
		>
			<button type="submit" className="text-sm text-red-600 hover:text-red-800">
				Delete employee
			</button>
		</form>
	);
}
