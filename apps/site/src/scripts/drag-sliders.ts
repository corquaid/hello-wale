// Powers every horizontally-scrolling card slider on the site (mobile pillar/stat/
// step tiles). Each slider is a self-contained block matching this shape:
//
//   <div data-slider>
//     <div data-track>
//       <div data-slide>...</div>
//       ...
//     </div>
//     <div>
//       <button data-dot="0">...</button>
//       ...
//     </div>
//   </div>
//
// Attributes are generic on purpose — this runs once per page and initializes
// every matching slider independently, however many are present.
export function initDragSliders() {
	document.querySelectorAll<HTMLElement>("[data-slider]").forEach((slider) => {
		const track = slider.querySelector<HTMLElement>("[data-track]");
		const slides = Array.from(slider.querySelectorAll<HTMLElement>("[data-slide]"));
		const dots = Array.from(slider.querySelectorAll<HTMLButtonElement>("[data-dot]"));
		if (!track || slides.length === 0 || dots.length === 0) return;

		const setActive = (index: number) => {
			dots.forEach((dot, i) => dot.setAttribute("data-active", String(i === index)));
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = slides.indexOf(entry.target as HTMLElement);
						if (index !== -1) setActive(index);
					}
				});
			},
			{ root: track, threshold: 0.6 },
		);
		slides.forEach((slide) => observer.observe(slide));

		dots.forEach((dot, index) => {
			dot.addEventListener("click", () => {
				slides[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
			});
		});

		setActive(0);

		// Pointer-drag to scroll (mouse/trackpad users; touch already scrolls natively).
		// Tracked via window (not setPointerCapture) — capturing the pointer on track
		// retargets the ensuing click to the track itself, breaking nested links/buttons.
		let isDragging = false;
		let dragged = false;
		let startX = 0;
		let startScrollLeft = 0;
		let pendingDx: number | null = null;

		const applyScroll = () => {
			if (pendingDx === null) return;
			track.scrollLeft = startScrollLeft - pendingDx;
			pendingDx = null;
		};

		track.addEventListener("pointerdown", (e) => {
			if (e.pointerType === "touch") return;
			isDragging = true;
			dragged = false;
			startX = e.clientX;
			startScrollLeft = track.scrollLeft;
			// CSS scroll-snap fights manual scrollLeft updates mid-drag, causing jitter —
			// suspend it while dragging and let it re-settle naturally on release.
			track.style.scrollSnapType = "none";
		});

		window.addEventListener("pointermove", (e) => {
			if (!isDragging) return;
			const dx = e.clientX - startX;
			if (Math.abs(dx) > 3) dragged = true;
			pendingDx = dx;
			requestAnimationFrame(applyScroll);
		});

		const endDrag = () => {
			if (!isDragging) return;
			isDragging = false;
			track.style.scrollSnapType = "";
		};
		window.addEventListener("pointerup", endDrag);
		window.addEventListener("pointercancel", endDrag);

		// Suppress the click that follows a drag so links/buttons don't fire accidentally.
		track.addEventListener(
			"click",
			(e) => {
				if (dragged) {
					e.preventDefault();
					e.stopPropagation();
				}
			},
			{ capture: true },
		);
	});
}
