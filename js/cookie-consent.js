/*
  Cleopatra Sideri — banner dei cookie

  Usa la libreria open source CookieConsent v3 di Orest Bida (licenza MIT),
  copiata in vendor/cookieconsent/ (nessun servizio esterno, nessun account).
  Documentazione: https://cookieconsent.orestbida.com

  Qui ci sono solo la configurazione e i testi in italiano.
  ▸ Categorie: "Necessari" (sempre attivi) e "Statistiche" (Google Analytics, solo con consenso).
  ▸ Quando il visitatore accetta le statistiche viene chiamata startAnalytics(),
    definita in js/analytics.js.
  ▸ Qualsiasi elemento con data-cc="show-preferencesModal" (es. il link
    "Preferenze cookie" nel footer) riapre le preferenze.
  ▸ Se si aggiunge un nuovo servizio con cookie, aumentare "revision": il banner
    verrà mostrato di nuovo a tutti.
*/
(function () {
  "use strict";

  if (!window.CookieConsent) return;

  // La pagina 404 usa percorsi assoluti (/css/...), le altre relativi
  var privacyUrl = document.querySelector('link[href^="/css/"]') ? "/privacy.html#cookie" : "privacy.html#cookie";

  function applyConsent() {
    if (window.CookieConsent.acceptedCategory("analytics") && window.startAnalytics) {
      window.startAnalytics();
    }
  }

  window.CookieConsent.run({
    revision: 1,

    cookie: {
      name: "cc_cookie",
      expiresAfterDays: 182 // la scelta viene richiesta di nuovo dopo 6 mesi
    },

    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom right",
        equalWeightButtons: true // "Accetta" e "Rifiuta" ugualmente visibili, come chiede il Garante
      },
      preferencesModal: {
        layout: "box",
        equalWeightButtons: true
      }
    },

    categories: {
      necessary: {
        enabled: true,
        readOnly: true
      },
      analytics: {
        autoClear: {
          cookies: [{ name: /^_ga/ }]
        }
      }
    },

    onConsent: applyConsent, // alla prima scelta e a ogni pagina, se il consenso c'è già
    onChange: function (param) {
      // Revoca del consenso: ricaricando, Google Analytics non viene più caricato
      if (param.changedCategories.indexOf("analytics") !== -1 && !window.CookieConsent.acceptedCategory("analytics")) {
        location.reload();
      } else {
        applyConsent();
      }
    },

    language: {
      default: "it",
      translations: {
        it: {
          consentModal: {
            title: "Posso contare le visite?",
            description: "Con il tuo consenso uso Google Analytics per capire, in forma aggregata, quali pagine vengono lette e migliorare il sito. Nessuna pubblicità. <a href=\"" + privacyUrl + "\">Maggiori informazioni</a>",
            acceptAllBtn: "Accetta",
            acceptNecessaryBtn: "Rifiuta",
            showPreferencesBtn: "Scegli"
          },
          preferencesModal: {
            title: "Preferenze cookie",
            acceptAllBtn: "Accetta tutti",
            acceptNecessaryBtn: "Rifiuta tutti",
            savePreferencesBtn: "Salva le scelte",
            closeIconLabel: "Chiudi",
            sections: [
              {
                description: "Puoi decidere quali cookie consentire. Puoi cambiare idea in qualsiasi momento dal link \"Preferenze cookie\" in fondo a ogni pagina."
              },
              {
                title: "Necessari",
                description: "Servono solo a ricordare la tua scelta su questo banner. Non raccolgono altri dati.",
                linkedCategory: "necessary"
              },
              {
                title: "Statistiche",
                description: "Google Analytics: conta le visite e i clic (ad esempio su WhatsApp o sul modulo contatti) in forma aggregata, per capire come migliorare il sito. Funzioni pubblicitarie disattivate.",
                linkedCategory: "analytics"
              },
              {
                title: "Maggiori informazioni",
                description: "Trovi tutti i dettagli nell'<a href=\"" + privacyUrl + "\">informativa privacy</a>."
              }
            ]
          }
        }
      }
    }
  });
})();
