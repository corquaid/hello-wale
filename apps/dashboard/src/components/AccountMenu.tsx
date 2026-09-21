"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/login/actions";

/**
 * The header's settings menu: the account screen, and the way out.
 *
 * Client-side because a dropdown needs state, but it holds no data of its own
 * — signing out is the same Server Action the header used to submit directly.
 */
export function AccountMenu() {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Subscribing while open, not on every render: a menu that stays closed
	// should not be listening to the whole document.
	useEffect(() => {
		if (!open) return;

		function handlePointerDown(event: MouseEvent) {
			if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setOpen(false);
		}

		document.addEventListener("mousedown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open]);

	const item = "block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50";

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setOpen((wasOpen) => !wasOpen)}
				aria-haspopup="menu"
				aria-expanded={open}
				aria-label="Account menu"
				className="hover:text-wale-700 rounded-md p-1.5 text-gray-500 hover:bg-gray-50"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-5 w-5"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
					/>
				</svg>
			</button>

			{/*
			 * Always mounted, hidden by class rather than by unmounting: React
			 * removes the element the instant `open` goes false, which leaves a
			 * transition nothing to animate on the way out. `inert` keeps the
			 * hidden menu out of the tab order and away from the pointer, which
			 * opacity alone would not.
			 */}
			<div
				role="menu"
				inert={!open}
				className={`absolute right-0 z-10 mt-2 w-44 origin-top-right overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg transition duration-150 ease-out motion-reduce:transition-none ${
					open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
				}`}
			>
				<Link role="menuitem" href="/account" onClick={() => setOpen(false)} className={item}>
					Account
				</Link>
				<form action={signOut}>
					<button role="menuitem" type="submit" className={item}>
						Sign out
					</button>
				</form>
			</div>
		</div>
	);
}
