/* =====================================================
   main.js – UI behavior only (no backend submission)
   ===================================================== */

(() => {
  "use strict";

  /* -------------------------
     Helpers
  ------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* -------------------------
     Mobile Navigation
  ------------------------- */
  const navToggle = $(".nav-toggle");
  const navMenu = $("#nav-menu");

  function openNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeNav() : openNav();
    });

    // Close on link click (mobile)
    $$("#nav-menu a").forEach(link => {
      link.addEventListener("click", closeNav);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* -------------------------
     Smooth Scroll (anchors only)
  ------------------------- */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const target = $(anchor.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  /* -------------------------
     Privacy / Terms Modals
  ------------------------- */
  const privacyModal = $("#privacy-modal");
  const termsModal = $("#terms-modal");

  function openModal(modal) {
    if (modal && typeof modal.showModal === "function") {
      modal.showModal();
    }
  }

  function closeModal(modal) {
    if (modal && typeof modal.close === "function") {
      modal.close();
    }
  }

  $$("[data-open]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.getAttribute("data-open");
      if (target === "privacy") openModal(privacyModal);
      if (target === "terms") openModal(termsModal);
      closeNav();
    });
  });

  $$("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest("dialog");
      closeModal(modal);
    });
  });

  // Click outside modal content closes dialog
  [privacyModal, termsModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      const rect = modal.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) closeModal(modal);
    });
  });

  /* -------------------------
     Form Validation (UI only)
  ------------------------- */
  function wireForm(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let valid = true;
      const required = $$("[required]", form);

      required.forEach(field => {
        if (!field.value.trim()) valid = false;
      });

      const email = $("input[type='email']", form);
      if (email && email.value) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        if (!ok) valid = false;
      }

      // Remove old message
      const existing = $(".form-message", form);
      if (existing) existing.remove();

      const message = document.createElement("div");
      message.className = "form-message";

      if (valid) {
        message.classList.add("success");
        message.innerHTML =
          "<strong>Thank you!</strong> This is a demo form. Submissions are not yet connected.";
        form.reset();
      } else {
        message.classList.add("error");
        message.innerHTML =
          "<strong>Please check the form.</strong> Complete all required fields with valid information.";
      }

      form.appendChild(message);
      message.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  $$("form[data-form]").forEach(wireForm);

})();
