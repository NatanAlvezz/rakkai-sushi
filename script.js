(() => {
  "use strict";

  const CONFIG = window.DAKKAI_CONFIG || {};
  const toast = document.querySelector("#toast");
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  };

  const cleanPhone = (value) => String(value || "").replace(/\D/g, "");
  const whatsappUrl = () => {
    const phone = cleanPhone(CONFIG.whatsapp);
    if (!phone) return "";
    return `https://wa.me/${phone}?text=${encodeURIComponent(CONFIG.mensagemWhatsApp || "Olá! Vim pelo site do DAKKAI Sushi.")}`;
  };

  const actionUrls = {
    whatsapp: whatsappUrl,
    delivery: () => CONFIG.delivery || whatsappUrl(),
    cardapio: () => CONFIG.cardapio || whatsappUrl(),
    reservas: () => CONFIG.reservas || whatsappUrl(),
    trabalheConosco: () => CONFIG.trabalheConosco || whatsappUrl(),
    instagram: () => CONFIG.instagram || "",
    maps: () => CONFIG.maps || ""
  };

  document.querySelectorAll("[data-action]").forEach((link) => {
    const action = link.dataset.action;
    const resolver = actionUrls[action];
    const url = typeof resolver === "function" ? resolver() : "";

    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      return;
    }

    link.href = "#";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Este link ainda precisa ser preenchido no arquivo config.js.");
    });
  });

  ["atendimento", "horario", "endereco"].forEach((field) => {
    document.querySelectorAll(`[data-field="${field}"]`).forEach((element) => {
      if (CONFIG[field]) element.textContent = CONFIG[field];
    });
  });

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");
  const closeMenu = () => {
    nav?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Abrir menu");
  };

  menuButton?.addEventListener("click", () => {
    const open = !nav?.classList.contains("open");
    nav?.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 900) closeMenu(); });

  const header = document.querySelector(".site-header");
  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealTargets = document.querySelectorAll(".section-label, .section-content, .principles article, .experience-card, .gallery-card, .contact-details");
  if ("IntersectionObserver" in window) {
    revealTargets.forEach((item) => item.classList.add("reveal-ready"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -45px" });
    revealTargets.forEach((item) => observer.observe(item));
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
/* =========================================================
   DAKKAI SUSHI — INTERAÇÕES PREMIUM
   Cole este código no FINAL do script.js
   Não remove nem altera as funções atuais do site.
========================================================= */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window;

  /**
   * Executa uma função depois que o HTML estiver carregado.
   */
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, {
        once: true
      });
      return;
    }

    callback();
  }

  /**
   * Header translúcido e compacto durante a rolagem.
   */
  function initializeHeaderEffect() {
    const header = document.querySelector(".site-header");

    if (!header) {
      return;
    }

    let ticking = false;

    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    }

    function requestHeaderUpdate() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateHeader);
    }

    updateHeader();

    window.addEventListener("scroll", requestHeaderUpdate, {
      passive: true
    });
  }

  /**
   * Revelação elegante dos elementos durante a rolagem.
   */
  function initializeScrollReveal() {
    const selectors = [
      ".section-label",
      ".kicker",
      ".section-content > h2",
      ".section-content > .lead",
      ".principles article",
      ".experience-card",
      ".gallery-heading > div",
      ".gallery-card",
      ".contact-grid > div",
      ".footer-inner > *"
    ];

    const elements = document.querySelectorAll(selectors.join(","));

    if (!elements.length) {
      return;
    }

    elements.forEach((element, index) => {
      element.classList.add("dakkai-reveal");
      element.dataset.delay = String((index % 3) + 1);
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px"
      }
    );

    elements.forEach((element) => observer.observe(element));
  }

  /**
   * Guarda a posição do ponteiro para criar iluminação dinâmica.
   */
  function initializePointerGlow() {
    const interactiveElements = document.querySelectorAll(
      ".brush-button, .principles article, .gallery-card"
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const bounds = element.getBoundingClientRect();

        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        element.style.setProperty("--pointer-x", `${x}px`);
        element.style.setProperty("--pointer-y", `${y}px`);
      });

      element.addEventListener("pointerleave", () => {
        element.style.removeProperty("--pointer-x");
        element.style.removeProperty("--pointer-y");
      });
    });
  }

  /**
   * Movimento 3D suave da logo principal.
   */
  function initializeLogoTilt() {
    if (reduceMotion || isTouchDevice) {
      return;
    }

    const logoFrame = document.querySelector(".hero-logo-frame");

    if (!logoFrame) {
      return;
    }

    let animationFrame = null;

    logoFrame.addEventListener("pointermove", (event) => {
      const bounds = logoFrame.getBoundingClientRect();

      const horizontal =
        (event.clientX - bounds.left) / bounds.width - 0.5;

      const vertical =
        (event.clientY - bounds.top) / bounds.height - 0.5;

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      animationFrame = window.requestAnimationFrame(() => {
        logoFrame.style.animationPlayState = "paused";
        logoFrame.style.transform = `
          perspective(900px)
          translateY(-4px)
          rotateX(${vertical * -5}deg)
          rotateY(${horizontal * 6}deg)
          scale(1.012)
        `;
      });
    });

    logoFrame.addEventListener("pointerleave", () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      logoFrame.style.transform = "";
      logoFrame.style.animationPlayState = "";
    });
  }

  /**
   * Movimento 3D discreto nos cards da galeria.
   */
  function initializeGalleryTilt() {
    if (reduceMotion || isTouchDevice) {
      return;
    }

    const cards = document.querySelectorAll(".gallery-card");

    cards.forEach((card) => {
      let animationFrame = null;

      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();

        const horizontal =
          (event.clientX - bounds.left) / bounds.width - 0.5;

        const vertical =
          (event.clientY - bounds.top) / bounds.height - 0.5;

        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }

        animationFrame = window.requestAnimationFrame(() => {
          card.style.transform = `
            perspective(1100px)
            rotateX(${vertical * -3.2}deg)
            rotateY(${horizontal * 3.8}deg)
            translateY(-5px)
          `;
        });
      });

      card.addEventListener("pointerleave", () => {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }

        card.style.transform = "";
      });
    });
  }

  /**
   * Pequeno efeito magnético para botões importantes.
   */
  function initializeMagneticButtons() {
    if (reduceMotion || isTouchDevice) {
      return;
    }

    const buttons = document.querySelectorAll(
      ".nav-cta, .whatsapp-float"
    );

    buttons.forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const bounds = button.getBoundingClientRect();

        const x =
          event.clientX - bounds.left - bounds.width / 2;

        const y =
          event.clientY - bounds.top - bounds.height / 2;

        button.style.transform = `
          translate(${x * 0.09}px, ${y * 0.12}px)
          scale(1.025)
        `;
      });

      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }

  /**
   * Onda translúcida no clique.
   */
  function initializeClickRipple() {
    const clickableElements = document.querySelectorAll(
      ".brush-button, .nav-cta, .contact-links a, .whatsapp-float"
    );

    clickableElements.forEach((element) => {
      element.addEventListener("pointerdown", (event) => {
        const oldRipple = element.querySelector(".dakkai-ripple");

        if (oldRipple) {
          oldRipple.remove();
        }

        const bounds = element.getBoundingClientRect();
        const ripple = document.createElement("span");

        ripple.className = "dakkai-ripple";
        ripple.style.left = `${event.clientX - bounds.left}px`;
        ripple.style.top = `${event.clientY - bounds.top}px`;

        element.appendChild(ripple);

        window.setTimeout(() => {
          ripple.remove();
        }, 750);
      });
    });
  }

  /**
   * Parallax extremamente suave na imagem do hero.
   */
  function initializeHeroParallax() {
    if (reduceMotion) {
      return;
    }

    const heroMedia = document.querySelector(".hero-media");

    if (!heroMedia) {
      return;
    }

    let ticking = false;

    function updateParallax() {
      const offset = Math.min(window.scrollY * 0.11, 70);

      heroMedia.style.transform = `translate3d(0, ${offset}px, 0) scale(1.045)`;
      ticking = false;
    }

    function requestParallaxUpdate() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }

    window.addEventListener("scroll", requestParallaxUpdate, {
      passive: true
    });
  }

  /**
   * Inicialização segura.
   */
  onReady(() => {
    document.documentElement.classList.add("dakkai-premium-effects");

    initializeHeaderEffect();
    initializeScrollReveal();
    initializePointerGlow();
    initializeLogoTilt();
    initializeGalleryTilt();
    initializeMagneticButtons();
    initializeClickRipple();
    initializeHeroParallax();
  });
})();
