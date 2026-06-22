/* =====================================================================
   TD-SOLAR motion layer  (Motion - motion.dev, vanilla CDN ESM)
   Logic per block: one clear focal sequence in the hero, calm staggered
   reveals for grids/lists, subtle scroll parallax on photos.
   Respects prefers-reduced-motion. Never hides content if it fails
   (CSS failsafe reveals everything after 2.6s).
   ===================================================================== */
import { animate, inView, stagger, scroll } from "https://cdn.jsdelivr.net/npm/motion@11/+esm";

const EASE = [0.16, 1, 0.3, 1];
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const q = (s, c) => Array.from((c || document).querySelectorAll(s));
const el1 = (s, c) => (c || document).querySelector(s);

if (!reduce) {
  const managed = new Set();

  /* HERO entrance is pure CSS (see td.css) so it shows instantly on load,
     never waiting for the Motion CDN. The process grid is driven by an
     IntersectionObserver in td.js + CSS (reliable, template-style stagger). */

  /* ---------- STAGGERED GROUPS (children animate on enter) ---------- */
  const groups = {
    ".td-svc-grid":                    ".td-svc-card",
    ".td-projects":                    ".td-project",
    ".td-quality-chips":               ".td-chip",
    ".td-faq-list":                    ".td-faq-item",
    ".footer-menu-wrapper":            ".footer-menu-single",
  };
  Object.keys(groups).forEach((g) => {
    const container = el1(g);
    if (!container) return;
    managed.add(container);
    const kids = q(groups[g], container);
    if (!kids.length) return;
    kids.forEach((k) => { managed.add(k); k.style.opacity = "0"; });
    inView(container, () => {
      animate(kids, { opacity: [0, 1], transform: ["translateY(22px)", "none"] },
        { duration: 0.6, ease: EASE, delay: stagger(0.07) });
    }, { margin: "0px 0px -12% 0px" });
  });

  /* ---------- SERVICES image: gentle scale-in once ---------- */
  const svcImg = el1("#svc-img");
  if (svcImg) {
    const wrap = svcImg.closest(".td-svc-imgwrap");
    svcImg.style.opacity = "0";
    inView(wrap || svcImg, () => {
      animate(svcImg, { opacity: [0, 1], transform: ["scale(1.06)", "scale(1)"] }, { duration: 0.9, ease: EASE });
    }, { margin: "0px 0px -10% 0px" });
  }

  /* ---------- GENERIC REVEAL: standalone .reveal blocks ---------- */
  q(".reveal").forEach((node) => {
    if (managed.has(node)) return;
    if (node.closest(".section.banner")) return;   // hero handled above
    inView(node, () => {
      animate(node, { opacity: [0, 1], transform: ["translateY(28px)", "none"] }, { duration: 0.7, ease: EASE });
    }, { margin: "0px 0px -10% 0px" });
  });

  /* ---------- SUBTLE SCROLL PARALLAX on photos ---------- */
  const parallax = [".about-us-image", ".td-quality-img img"];
  parallax.forEach((sel) => {
    const node = el1(sel);
    if (!node) return;
    scroll(
      animate(node, { transform: ["translateY(-16px)", "translateY(16px)"] }, { ease: "linear" }),
      { target: node, offset: ["start end", "end start"] }
    );
  });
}
