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
