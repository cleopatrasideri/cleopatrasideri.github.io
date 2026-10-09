/*
  Cleopatra Sideri — statistiche (Google Analytics 4)

  ▸ L'unica cosa da configurare è GA_MEASUREMENT_ID qui sotto.
  ▸ Il consenso è gestito da CookieConsent (vendor/cookieconsent, configurato in
    js/cookie-consent.js): Google Analytics viene caricato SOLO quando il visitatore
    accetta la categoria "Statistiche". Prima del consenso il sito non contatta Google.
  ▸ In locale (localhost o file aperto dal disco) GA non viene mai caricato:
    gli eventi vengono solo scritti nella console del browser, per controllarli.

  Eventi inviati, oltre a quelli automatici di GA4 (pagine viste, scroll al 90%,
  clic su link esterni, ricerche, download, interazioni con i form, tempo di coinvolgimento):
    whatsapp_click   clic su un link WhatsApp          (posizione, testo)
    phone_click      clic su un numero di telefono     (posizione)
    email_click      clic su un indirizzo email        (posizione)
    generate_lead    invio riuscito del modulo         (interesse scelto)  ← conversione principale
    form_error       invio del modulo non riuscito
    cta_click        clic su un bottone                (posizione, testo, destinazione)
    menu_click       clic su una voce del menu         (testo, destinazione)
    select_content   clic su una card dei percorsi     (percorso)
    faq_open         apertura di una domanda frequente (domanda)
    section_view     sezione vista per almeno 1 secondo (sezione)
    scroll_depth     scroll al 25, 50, 75, 100%
    page_not_found   visita alla pagina 404            (indirizzo cercato)
*/
(function () {
  "use strict";

  // ID di misurazione di Google Analytics 4 (formato G-XXXXXXXXXX)
  // DA COMPLETARE: inserire l'ID della proprietà GA4 di Cleopatra
  var GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

  var isLocal = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var isConfigured = /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX";
  var gaLoaded = false;

  // Caricamento di Google Analytics ------------------------------------------
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  function loadGA() {
    if (gaLoaded || isLocal || !isConfigured) return;
    gaLoaded = true;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  function track(name, params) {
    if (isLocal) {
      console.info("[analytics]", name, params || {});
      return;
    }
    if (gaLoaded) gtag("event", name, params || {});
  }

  // Chiamata da js/cookie-consent.js quando il visitatore accetta le statistiche
  window.startAnalytics = loadGA;

  // Eventi ------------------------------------------------------------------

  // Posizione di un elemento: la sezione (id o commento eyebrow) o l'area del sito
  function locationOf(el) {
    if (el.closest(".mobile-cta")) return "barra_mobile";
    if (el.closest(".site-header")) return "menu";
    if (el.closest(".site-footer")) return "footer";
    var section = el.closest("section");
    if (section) {
      if (section.id) return section.id;
      if (section.classList.contains("hero") || section.classList.contains("page-hero")) return "hero";
      var eyebrow = section.querySelector(".eyebrow");
      if (eyebrow) return eyebrow.textContent.trim().toLowerCase().slice(0, 40);
    }
    return "altro";
  }

  function textOf(el) {
    return (el.innerText || el.textContent || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 80);
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    var params = { posizione: locationOf(link), testo: textOf(link) };

    if (href.indexOf("https://wa.me/") === 0) {
      track("whatsapp_click", params);
    } else if (href.indexOf("tel:") === 0) {
      track("phone_click", params);
    } else if (href.indexOf("mailto:") === 0) {
      track("email_click", params);
    } else if (link.classList.contains("path-card")) {
      track("select_content", { content_type: "percorso", item_id: href, posizione: params.posizione });
    } else if (link.closest(".site-nav")) {
      track("menu_click", { testo: params.testo, destinazione: href });
    } else if (link.classList.contains("btn")) {
      track("cta_click", { posizione: params.posizione, testo: params.testo, destinazione: href });
    }
  });

  // Modulo contatti (eventi lanciati da main.js)
  document.addEventListener("contactform:sent", function (event) {
    track("generate_lead", { interesse: (event.detail && event.detail.interesse) || "" });
  });
  document.addEventListener("contactform:error", function () {
    track("form_error");
  });

  // Domande frequenti aperte
  document.querySelectorAll(".faq details").forEach(function (details) {
    details.addEventListener("toggle", function () {
      if (details.open) track("faq_open", { domanda: textOf(details.querySelector("summary")) });
    });
  });

  // Sezioni viste (almeno metà visibile per 1 secondo, una volta per pagina)
  if ("IntersectionObserver" in window) {
    var timers = new WeakMap();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var section = entry.target;
        if (entry.isIntersecting) {
          timers.set(section, setTimeout(function () {
            track("section_view", { sezione: locationOf(section.firstElementChild || section) });
            observer.unobserve(section);
          }, 1000));
        } else {
          clearTimeout(timers.get(section));
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll("main section:not([hidden])").forEach(function (s) {
      observer.observe(s);
    });
  }

  // Profondità di scroll
  var marks = [25, 50, 75, 100];
  window.addEventListener("scroll", function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    var percent = (window.scrollY / max) * 100;
    while (marks.length && percent >= marks[0] - 1) {
      track("scroll_depth", { percentuale: marks.shift() });
    }
  }, { passive: true });

  // Pagina non trovata
  if (document.body.hasAttribute("data-404")) {
    track("page_not_found", { indirizzo: location.pathname });
  }
})();
