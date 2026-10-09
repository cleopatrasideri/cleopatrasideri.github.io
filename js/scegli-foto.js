/*
  STRUMENTO TEMPORANEO per scegliere le foto (da eliminare dopo la scelta,
  insieme alla cartella img/candidati e ai due <script> che lo caricano).

  Funziona solo in locale (localhost o file aperto dal disco):
    - clic su una foto        → candidato successivo
    - Maiusc + clic           → candidato precedente
    - le scelte restano salvate nel browser e valgono su tutte le pagine
    - il pannello in alto a sinistra mostra le scelte; "Copia scelte" le copia
      negli appunti, da incollare a chi aggiorna il sito
*/
(function () {
  "use strict";

  var isLocal = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (!isLocal || !window.CANDIDATI) return;

  var STORAGE = "scelta-foto";
  var choices = {};
  try {
    choices = JSON.parse(localStorage.getItem(STORAGE)) || {};
  } catch (e) {
    choices = {};
  }

  function save() {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(choices));
    } catch (e) {
      /* senza localStorage la scelta vale solo per questa pagina */
    }
  }

  // Trova la "posizione" (es. danza-libera.jpg) di un'immagine
  function slotOf(img) {
    var stored = img.getAttribute("data-slot");
    if (stored) return stored;
    var match = (img.getAttribute("src") || "").match(/img\/foto\/([a-z0-9-]+)\.(?:jpg|webp)/);
    var key = match && match[1] + ".jpg";
    return key && window.CANDIDATI[key] ? key : null;
  }

  var images = Array.prototype.filter.call(document.images, function (img) {
    var slot = slotOf(img);
    if (slot) img.setAttribute("data-slot", slot);
    return !!slot;
  });

  function show(slot) {
    var list = window.CANDIDATI[slot];
    var c = list[choices[slot] || 0];
    images.forEach(function (img) {
      if (img.getAttribute("data-slot") !== slot) return;
      img.src = c.src;
      img.width = c.w;
      img.height = c.h;
      img.title = slot + " — candidato " + ((choices[slot] || 0) + 1) + " di " + list.length + " (clic: successivo, Maiusc+clic: precedente)";
    });
    renderPanel();
  }

  // Pannello con le scelte
  var panel = document.createElement("div");
  panel.setAttribute("style", [
    "position:fixed", "left:12px", "top:80px", "z-index:9999", "max-width:320px",
    "padding:12px 14px", "border-radius:12px", "background:#2c1a2e", "color:#fff",
    "font:13px/1.45 system-ui,sans-serif", "box-shadow:0 8px 24px rgba(0,0,0,.35)"
  ].join(";"));
  document.body.appendChild(panel);

  function renderPanel() {
    var rows = Object.keys(window.CANDIDATI).map(function (slot) {
      var n = (choices[slot] || 0) + 1;
      return "<div>" + slot + ": <b>" + n + "</b> / " + window.CANDIDATI[slot].length + "</div>";
    }).join("");
    panel.innerHTML = "<b>Scelta foto</b> · clic sulla foto per cambiarla" +
      "<div style='margin:6px 0;opacity:.85'>" + rows + "</div>" +
      "<button type='button' style='font:inherit;padding:4px 10px;border-radius:6px;border:0;cursor:pointer'>Copia scelte</button>" +
      " <span data-msg></span>";
    panel.querySelector("button").addEventListener("click", copy);
  }

  function copy() {
    var out = {};
    Object.keys(window.CANDIDATI).forEach(function (slot) {
      out[slot] = window.CANDIDATI[slot][choices[slot] || 0].src;
    });
    var text = JSON.stringify(out, null, 1);
    var msg = panel.querySelector("[data-msg]");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        msg.textContent = "copiato!";
      }, function () {
        window.prompt("Copia questo testo:", text);
      });
    } else {
      window.prompt("Copia questo testo:", text);
    }
  }

  images.forEach(function (img) {
    img.style.cursor = "pointer";
    img.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var slot = img.getAttribute("data-slot");
      var total = window.CANDIDATI[slot].length;
      var step = event.shiftKey ? -1 : 1;
      choices[slot] = ((choices[slot] || 0) + step + total) % total;
      save();
      show(slot);
    });
  });

  // Mostra subito le scelte salvate (preventDefault sopra evita che le card-link cambino pagina)
  Object.keys(window.CANDIDATI).forEach(show);
})();
