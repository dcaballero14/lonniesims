// === js/main.js ===

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---- 1) Mobile nav toggle
  const navToggle = $(".nav-toggle");
  const navMenu = $("#nav-menu");

  const closeMenu = () => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    // Close menu on outside click (mobile)
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      const clickedInsideNav = navMenu.contains(target) || navToggle.contains(target);
      if (!clickedInsideNav) closeMenu();
    });

    // Close on Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close after clicking a link (mobile)
    $$("#nav-menu a").forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });
  }

  // ---- 2) Last updated stamp
  const stamps = $$("[data-last-updated]");
  if (stamps.length) {
    const now = new Date();
    const formatted = now.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    stamps.forEach((el) => (el.textContent = formatted));
  }

  // ---- 3) Privacy / Terms modal open/close
  const privacyModal = $("#privacy-modal");
  const termsModal = $("#terms-modal");

  const openDialog = (dlg) => {
    if (!dlg) return;
    if (typeof dlg.showModal === "function") dlg.showModal();
  };

  const closeDialog = (dlg) => {
    if (!dlg) return;
    if (typeof dlg.close === "function") dlg.close();
  };

  $$("[data-open]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const which = btn.getAttribute("data-open");
      if (which === "privacy") openDialog(privacyModal);
      if (which === "terms") openDialog(termsModal);
      closeMenu(); // if nav is open on mobile
    });
  });

  // Close buttons inside dialogs
  $$("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // find nearest dialog
      const dlg = btn.closest("dialog");
      closeDialog(dlg);
    });
  });

  // Click outside modal content closes dialog (native dialog only closes via ::backdrop click in some browsers, so implement)
  [privacyModal, termsModal].forEach((dlg) => {
    if (!dlg) return;
    dlg.addEventListener("click", (e) => {
      const rect = dlg.getBoundingClientRect();
      const clickedInDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      // If user clicks the backdrop area (outside the dialog content box), close
      if (!clickedInDialog) closeDialog(dlg);
    });
  });

  // ---- 4) Lightweight form UX (client-side only; no submission)
  const wireForm = (form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic required check
      const required = $$("[required]", form);
      let ok = true;

      required.forEach((el) => {
        if (!el.value || !String(el.value).trim()) ok = false;
      });

      // Email validation if present
      const email = $("input[type='email']", form);
      if (email && email.value) {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        if (!valid) ok = false;
      }

      // Show message
      const existing = $(".form-success", form);
      if (existing) existing.remove();

      const msg = document.createElement("div");
      msg.className = "form-success";

      if (ok) {
        msg.innerHTML =
          "<strong>Thanks!</strong> This demo form doesn’t submit anywhere yet. Wire it to your email/CRM tool when ready.";
        form.reset();
      } else {
        msg.innerHTML =
          "<strong>Check the form:</strong> please complete required fields (and a valid email if included).";
      }

      form.appendChild(msg);
      msg.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  $$("form[data-form]").forEach(wireForm);
})();
