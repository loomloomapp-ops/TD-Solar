/* =====================================================================
   TD-SOLAR / DC Montage  -  Interactions
   - Sticky header (hide on scroll down, show on scroll up)
   - Mobile menu (slide-in)
   - Scroll reveal (IntersectionObserver)
   - Active nav link via scroll spy
   - Light hero parallax (rAF, reduced-motion aware)
   - FAQ accordion
   - Floating WhatsApp FAB menu
   - Mobile sticky CTA visibility
   - Modal / popup (open, ESC, click-outside, focus trap)
   - Form handling (validation, success/error, endpoint-ready + mailto fallback)
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------
     FORM ENDPOINT
     Leer = mailto-Fallback an tdsolar265@gmail.com (öffnet das
     E-Mail-Programm des Nutzers, funktioniert ohne Backend).

     Zum Aktivieren eines echten Versands eine der Optionen eintragen:
       Formspree:  "https://formspree.io/f/XXXXXXXX"
       Netlify:    Formular braucht zusätzlich data-netlify (siehe Doku)
       Eigener:    URL des eigenen POST-Endpoints
     Der Code sendet dann JSON per fetch() an FORM_ENDPOINT.
  --------------------------------------------------------------- */
  var FORM_ENDPOINT = "";
  var TARGET_EMAIL = "tdsolar265@gmail.com";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header: hide on scroll down, show on scroll up ---------- */
  var header = $("#header");
  var lastY = window.pageYOffset;
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    if (header) {
      header.classList.toggle("is-scrolled", y > 20);
      if (y > lastY && y > 300 && !document.body.classList.contains("menu-open")) {
        header.classList.add("is-hidden");
      } else {
        header.classList.remove("is-hidden");
      }
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = $("#burger");
  var mobileMenu = $("#mobile-menu");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    if (burger) burger.setAttribute("aria-expanded", String(open));
    if (mobileMenu) mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) {
    burger.addEventListener("click", function () {
      setMenu(!document.body.classList.contains("menu-open"));
    });
  }
  if (mobileMenu) {
    $$(".mobile-menu__link", mobileMenu).forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = $$(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revObs.observe(el); });
  }

  /* ---------- Scroll spy (active nav link) ---------- */
  var navLinks = $$(".nav__link");
  var sections = navLinks
    .map(function (l) { return document.getElementById(l.getAttribute("href").slice(1)); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle("is-active", l.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Hero parallax (subtle) ---------- */
  var parallax = $("[data-parallax]");
  if (parallax && !prefersReduced) {
    var pTicking = false;
    var update = function () {
      var rect = parallax.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.bottom > 0 && rect.top < vh) {
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -0.5..0.5
        parallax.style.transform = "scale(1.06) translateY(" + (progress * -16).toFixed(2) + "px)";
      }
      pTicking = false;
    };
    parallax.style.transform = "scale(1.06)";
    window.addEventListener("scroll", function () {
      if (!pTicking) { window.requestAnimationFrame(update); pTicking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- FAQ accordion ---------- */
  $$(".faq-item").forEach(function (item) {
    var btn = $(".faq-item__q", item);
    var panel = $(".faq-item__a", item);
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      // close others
      $$(".faq-item.is-open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("is-open");
          $(".faq-item__q", other).setAttribute("aria-expanded", "false");
          $(".faq-item__a", other).style.height = "0px";
        }
      });
      if (isOpen) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        panel.style.height = "0px";
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        panel.style.height = panel.scrollHeight + "px";
      }
    });
  });
  window.addEventListener("resize", function () {
    $$(".faq-item.is-open .faq-item__a").forEach(function (p) {
      p.style.height = p.scrollHeight + "px";
    });
  });

  /* ---------- Floating WhatsApp FAB ---------- */
  var fab = $("#fab");
  var fabToggle = $("#fab-toggle");
  if (fab && fabToggle) {
    fabToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = fab.classList.toggle("is-open");
      fabToggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (fab.classList.contains("is-open") && !fab.contains(e.target)) {
        fab.classList.remove("is-open");
        fabToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Mobile sticky CTA visibility (show after hero) ---------- */
  var mobileCta = $("#mobile-cta");
  var heroSection = $("#start");
  if (mobileCta && heroSection && "IntersectionObserver" in window) {
    var ctaObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        mobileCta.classList.toggle("is-visible", !e.isIntersecting);
      });
    }, { threshold: 0, rootMargin: "-60px 0px 0px 0px" });
    ctaObs.observe(heroSection);
  } else if (mobileCta) {
    mobileCta.classList.add("is-visible");
  }

  /* ---------- Modal / popup ---------- */
  var modal = $("#modal");
  var modalDialog = $(".modal__dialog", modal);
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // close FAB if open
    if (fab) { fab.classList.remove("is-open"); }
    var first = modal.querySelector("input, select, textarea, button");
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = document.body.classList.contains("menu-open") ? "hidden" : "";
    if (lastFocused) lastFocused.focus();
  }

  $$("[data-open-modal]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openModal(); });
  });
  if (modal) {
    $("#modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
      // focus trap
      if (e.key === "Tab" && modal.classList.contains("is-open")) {
        var focusables = $$('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])', modalDialog)
          .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Forms ---------- */
  function showError(field, on) {
    field.classList.toggle("field--error", on);
  }
  function validate(form) {
    var ok = true;
    $$("[required]", form).forEach(function (input) {
      var field = input.closest(".field") || input.closest(".consent");
      var valid = true;
      if (input.type === "checkbox") valid = input.checked;
      else if (input.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      else valid = input.value.trim().length > 0;
      if (field) showError(field, !valid);
      if (!valid) ok = false;
    });
    return ok;
  }
  function getStatus(form, type) {
    return $(".form-status--" + type, form);
  }
  function hideStatuses(form) {
    $$(".form-status", form).forEach(function (s) { s.classList.remove("is-visible"); });
  }
  function serialize(form) {
    var data = {};
    $$("input, select, textarea", form).forEach(function (el) {
      if (!el.name || el.name === "company") return; // skip honeypot
      if (el.type === "checkbox") data[el.name] = el.checked ? "Ja" : "Nein";
      else data[el.name] = el.value.trim();
    });
    return data;
  }
  function mailtoFallback(data) {
    var subject = "PV-Montage Anfrage - " + (data.name || "Website");
    var lines = [
      "Name: " + (data.name || ""),
      "Telefon: " + (data.telefon || ""),
      "E-Mail: " + (data.email || ""),
      "Gewünschte Leistung: " + (data.leistung || ""),
      "Kommentar: " + (data.kommentar || ""),
      "Datenschutz akzeptiert: " + (data.datenschutz || "")
    ];
    return "mailto:" + TARGET_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function handleSubmit(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideStatuses(form);

      // Honeypot: if filled -> silently ignore (bot)
      var hp = form.querySelector('input[name="company"]');
      if (hp && hp.value) return;

      if (!validate(form)) return;

      var data = serialize(form);
      var submitBtn = $('button[type="submit"]', form);
      var originalText = submitBtn ? submitBtn.textContent : "";

      function onOk() {
        getStatus(form, "ok").classList.add("is-visible");
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
      }
      function onErr() {
        getStatus(form, "err").classList.add("is-visible");
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Wird gesendet ..."; }

      if (FORM_ENDPOINT) {
        // Real endpoint (Formspree / eigener Endpoint)
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        }).then(function (res) {
          if (res.ok) onOk(); else onErr();
        }).catch(onErr);
      } else {
        // mailto-Fallback: öffnet das E-Mail-Programm an tdsolar265@gmail.com
        try {
          window.location.href = mailtoFallback(data);
          onOk();
        } catch (err) {
          onErr();
        }
      }
    });
  }

  $$("#anfrage-form, #modal-form").forEach(function (f) { if (f) handleSubmit(f); });

  // Clear error state while typing
  $$("input, select, textarea").forEach(function (el) {
    el.addEventListener("input", function () {
      var field = el.closest(".field") || el.closest(".consent");
      if (field) field.classList.remove("field--error");
    });
  });
})();
