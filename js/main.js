/*
  Cleopatra Sideri — script del sito
  Fa solo tre cose (le statistiche sono in js/analytics.js):
    1. apre/chiude il menu su mobile
    2. scrive l'anno corrente nel footer
    3. invia il form contatti senza cambiare pagina (se JavaScript è disattivato
       il form funziona lo stesso e porta alla pagina grazie.html)
*/
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  // 1. Menu mobile -----------------------------------------------------------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    var closeMenu = function () {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    };

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });

    // Chiude il menu quando si sceglie una voce o si preme Esc
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  // 2. Anno nel footer -------------------------------------------------------
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // 3. Form contatti (Web3Forms) ---------------------------------------------
  document.querySelectorAll("form[data-contact-form]").forEach(function (form) {
    var status = form.querySelector(".form__status");
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (event) {
      if (!window.fetch || !window.FormData) return; // browser vecchi: invio classico

      event.preventDefault();
      button.disabled = true;
      status.className = "form__status";
      status.textContent = "Invio in corso…";

      fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (!data.success) throw new Error(data.message);
          // Avvisa le statistiche (js/analytics.js) prima di svuotare il modulo
          var interesse = form.querySelector('[name="interesse"]');
          document.dispatchEvent(new CustomEvent("contactform:sent", {
            detail: { interesse: interesse ? interesse.value : "" }
          }));
          form.reset();
          status.classList.add("form__status--ok");
          status.textContent = "Grazie! Ho ricevuto il tuo messaggio, ti rispondo al più presto.";
        })
        .catch(function () {
          document.dispatchEvent(new CustomEvent("contactform:error"));
          status.classList.add("form__status--error");
          status.textContent =
            "Ops, qualcosa non ha funzionato. Scrivimi su WhatsApp al 328 690 3680, ti rispondo lì.";
        })
        .finally(function () {
          button.disabled = false;
        });
    });
  });
})();
