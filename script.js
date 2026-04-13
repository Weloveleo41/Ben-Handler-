/**
 * Info Ventures — single-viewport editorial site.
 * Keeps the layout from overflowing on short viewports by
 * nudging the root font-size down as needed.
 */

(function () {
    "use strict";

    const page = document.querySelector(".page");
    if (!page) return;

    // On very short viewports, scale the headline gently so the page
    // never needs to scroll on a typical laptop.
    function fit() {
        const vh = window.innerHeight;
        const root = document.documentElement;

        if (vh < 720) {
            root.style.fontSize = (14 + (vh - 560) * 0.005).toFixed(2) + "px";
        } else {
            root.style.fontSize = "";
        }
    }

    fit();
    window.addEventListener("resize", fit, { passive: true });

    // Smooth-scroll anchor (defensive — the page itself doesn't scroll,
    // but in-page anchors still flash target state nicely).
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const id = a.getAttribute("href");
            if (id.length <= 1) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
})();
