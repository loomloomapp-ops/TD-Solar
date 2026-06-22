/* TD-SOLAR interactions (vanilla, no Webflow runtime).
   Visual styling comes from the template stylesheet; this only wires behaviour. */
(function () {
  "use strict";

  /* ---- FORM ENDPOINT ----
     Leer = mailto-Fallback an tdsolar265@gmail.com.
     Für echten Versand: Formspree-/Netlify-/EmailJS-/eigene-Endpoint-URL eintragen. */
  var FORM_ENDPOINT = "";
  var TARGET_EMAIL = "tdsolar265@gmail.com";

  var d = document, b = document.body;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  d.documentElement.classList.add("js");

  /* year */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  /* most reveals are handled by js/anim.js (Motion); the working-process grid
     uses a plain IntersectionObserver here so its staggered card + inner-element
     animation always fires, independent of the Motion CDN. */
  (function () {
    var grids = $$(".td-proc-grid");
    if (!grids.length) return;
    if (reduced || !("IntersectionObserver" in window)) {
      grids.forEach(function (g) { g.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    grids.forEach(function (g) { io.observe(g); });
  })();

  /* ---- mobile menu ---- */
  var burger = $("#burger"), mnav = $("#mnav"), mclose = $("#mclose");
  function setNav(open) {
    b.classList.toggle("mnav-open", open);
    if (burger) burger.setAttribute("aria-expanded", String(open));
    if (mnav) mnav.setAttribute("aria-hidden", String(!open));
    b.style.overflow = open ? "hidden" : "";
  }
  if (burger) burger.addEventListener("click", function () { setNav(!b.classList.contains("mnav-open")); });
  if (mclose) mclose.addEventListener("click", function () { setNav(false); });
  if (mnav) $$(".l, .c a", mnav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });

  /* ---- services: hover/focus swaps the big image ---- */
  var svcImg = $("#svc-img"), svcTag = $("#svc-imgtag"), svcList = $("#svc-list");
  if (svcImg && svcList) {
    var items = $$(".td-svc-item", svcList);
    items.forEach(function (it) {
      function activate() {
        items.forEach(function (x) { x.classList.remove("is-active"); });
        it.classList.add("is-active");
        var src = it.getAttribute("data-img"); if (src) svcImg.src = src;
        if (svcTag) svcTag.textContent = it.getAttribute("data-tag") || "";
      }
      it.addEventListener("mouseenter", activate);
      it.addEventListener("focusin", activate);
      it.addEventListener("click", activate);
    });
  }

  /* ---- FAQ accordion ---- */
  $$(".td-faq-item").forEach(function (item) {
    var q = $(".td-faq-q", item), a = $(".td-faq-a", item);
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      $$(".td-faq-item.open").forEach(function (o) {
        if (o !== item) { o.classList.remove("open"); $(".td-faq-q", o).setAttribute("aria-expanded", "false"); $(".td-faq-a", o).style.height = "0px"; }
      });
      if (open) { item.classList.remove("open"); q.setAttribute("aria-expanded", "false"); a.style.height = "0px"; }
      else { item.classList.add("open"); q.setAttribute("aria-expanded", "true"); a.style.height = a.scrollHeight + "px"; }
    });
  });
  window.addEventListener("resize", function () {
    $$(".td-faq-item.open .td-faq-a").forEach(function (p) { p.style.height = p.scrollHeight + "px"; });
  });

  /* ---- modal ---- */
  var modal = $("#modal"), dialog = $(".td-modal__d", modal), lastFocus = null;
  function openModal() {
    lastFocus = d.activeElement;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); b.style.overflow = "hidden";
    var f = modal.querySelector("input,select,textarea,button"); if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeModal() {
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
    b.style.overflow = b.classList.contains("mnav-open") ? "hidden" : "";
    if (lastFocus) lastFocus.focus();
  }
  $$("[data-open-modal]").forEach(function (el) { el.addEventListener("click", function (e) { e.preventDefault(); openModal(); }); });
  if (modal) {
    $("#modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
      if (e.key === "Tab" && modal.classList.contains("open")) {
        var f = $$('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])', dialog).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- forms ---- */
  function validate(form) {
    var ok = true;
    $$("[required]", form).forEach(function (input) {
      var field = input.closest(".td-field") || input.closest(".td-consent");
      var valid = input.type === "checkbox" ? input.checked
        : input.type === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())
        : input.value.trim().length > 0;
      if (field && field.classList.contains("td-field")) field.classList.toggle("err", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }
  function statuses(form) { $$(".td-status", form).forEach(function (s) { s.classList.remove("show"); }); }
  function data(form) {
    var o = {};
    $$("input,select,textarea", form).forEach(function (el) {
      if (!el.name || el.name === "company") return;
      o[el.name] = el.type === "checkbox" ? (el.checked ? "Ja" : "Nein") : el.value.trim();
    });
    return o;
  }
  function mailto(o) {
    var body = ["Name: " + (o.name || ""), "Telefon: " + (o.telefon || ""), "E-Mail: " + (o.email || ""),
      "Gewünschte Leistung: " + (o.leistung || ""), "Kommentar: " + (o.kommentar || ""),
      "Datenschutz: " + (o.datenschutz || "")].join("\n");
    return "mailto:" + TARGET_EMAIL + "?subject=" + encodeURIComponent("PV-Montage Anfrage - " + (o.name || "Website")) + "&body=" + encodeURIComponent(body);
  }
  $$("#anfrage-form, #modal-form").forEach(function (form) {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statuses(form);
      var hp = form.querySelector('input[name="company"]'); if (hp && hp.value) return;
      if (!validate(form)) return;
      var o = data(form);
      var btn = form.querySelector('button[type="submit"]');
      var lbl = btn ? btn.querySelector(".primary-button-text-block") : null;
      var orig = lbl ? lbl.textContent : "";
      function ok() { $(".td-status.ok", form).classList.add("show"); form.reset(); if (lbl) lbl.textContent = orig; if (btn) btn.disabled = false; }
      function bad() { $(".td-status.bad", form).classList.add("show"); if (lbl) lbl.textContent = orig; if (btn) btn.disabled = false; }
      if (btn) btn.disabled = true; if (lbl) lbl.textContent = "Wird gesendet ...";
      if (FORM_ENDPOINT) {
        fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(o) })
          .then(function (r) { r.ok ? ok() : bad(); }).catch(bad);
      } else {
        try { window.location.href = mailto(o); ok(); } catch (err) { bad(); }
      }
    });
  });
  $$(".td-field input,.td-field select,.td-field textarea").forEach(function (el) {
    el.addEventListener("input", function () { var f = el.closest(".td-field"); if (f) f.classList.remove("err"); });
  });
})();
