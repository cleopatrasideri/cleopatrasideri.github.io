# Sito di Cleopatra Sideri — Biodanza e Reiki

Sito vetrina statico di **Cleopatra Sideri**, Montesilvano (PE): Biodanza per adulti, bambini e ragazzi, e trattamenti/corsi di Reiki. (La terza età non viene proposta come attività dedicata: Cleopatra non ha le certificazioni specifiche.)

- Indirizzo: <https://cleopatrasideri.github.io> (provvisorio, finché il dominio `cleopatrasideri.it` non è attivo: vedi "Dominio provvisorio" in [docs/DA-COMPLETARE.md](docs/DA-COMPLETARE.md))
- Contatti di Cleopatra: tel/WhatsApp **328 690 3680**, email **sidercleo@gmail.com**
- Hosting: GitHub Pages (gratuito). Dominio: `cleopatrasideri.it`, intestato a Cleopatra.

Il sito è stato pensato per essere **mantenuto da chiunque**, anche senza esperienza di sviluppo web, circa **una volta l'anno**. Per questo non c'è niente da installare, compilare o aggiornare: solo file HTML, un foglio di stile e poche righe di JavaScript.

> Questo file è per chi mette mano al sito (sviluppatori, tecnici, amici volenterosi).
> Se sei Cleopatra, il documento per te è [docs/GUIDA-CLEOPATRA.md](docs/GUIDA-CLEOPATRA.md).
>
> **La cartella `docs/` è un repository privato separato** (`cleopatra-sideri-docs`, sull'account GitHub di Cleopatra): contiene documentazione interna, listino indicativo e strategia, che non devono essere pubblici. Su GitHub i link a `docs/` da questo repository pubblico non funzionano: per leggerli serve l'accesso al repository privato (chiederlo a Cleopatra).

---

## Indice

1. [Scelte tecniche](#scelte-tecniche)
2. [Struttura delle cartelle](#struttura-delle-cartelle)
3. [Vedere il sito in locale](#vedere-il-sito-in-locale)
4. [Convenzioni](#convenzioni)
5. [Voglio cambiare… → dove si fa](#voglio-cambiare--dove-si-fa)
6. [Come pubblicare una modifica](#come-pubblicare-una-modifica)
7. [Servizi esterni](#servizi-esterni)
8. [Crediti foto](#crediti-foto)
9. [Altri documenti](#altri-documenti)

---

## Scelte tecniche

| Cosa | Scelta | Perché |
|---|---|---|
| Pagine | HTML5 scritto a mano | Si apre e si modifica con qualsiasi editor di testo |
| Stile | Un solo file `css/style.css`, con le variabili (colori, font, spaziature) in testa | Un solo posto dove guardare |
| Script | `js/main.js` minimo: menu mobile, anno nel footer, invio del form senza cambiare pagina | Il sito funziona anche con JavaScript disattivato |
| Build | **Nessuna** | Il sito non si compila. Node/npm servono solo per il server locale di sviluppo (Vite, `npm run dev`) |
| Font | Fraunces (titoli) e Nunito Sans (testo), file `.woff2` ospitati nel sito | Nessuna chiamata a Google Fonts: più semplice per il GDPR |
| Hosting | GitHub Pages | Gratuito, HTTPS incluso, si aggiorna da solo a ogni commit |
| Form | Web3Forms | Gratuito, nessun server da gestire |
| Statistiche | Google Analytics 4 (`js/analytics.js`) | Gratuito; si carica solo dopo il consenso (richiesto dal Garante) |
| Banner cookie | [CookieConsent](https://cookieconsent.orestbida.com) v3.1.0 di Orest Bida, open source (MIT), copiata in `vendor/cookieconsent/`; testi e configurazione in `js/cookie-consent.js` | Lo standard open source più diffuso: nessun account, nessun costo, nessuna richiesta a server esterni |

Tailwind e simili sono stati scartati di proposito: richiedono un passaggio di build, che fra un anno nessuno ricorderà come lanciare.

---

## Struttura delle cartelle

```
cleopatra-sideri/
├── index.html                 Home: Biodanza per tutti, focus adulti
├── biodanza-bambini.html      Biodanza per bambini e ragazzi
├── reiki.html                 Reiki: trattamenti e corsi
├── privacy.html               Informativa privacy
├── grazie.html                Pagina dopo l'invio del form
├── 404.html                   Pagina "non trovata" (usata da GitHub Pages)
├── css/
│   └── style.css              Tutto lo stile; variabili in :root all'inizio
├── js/
│   ├── main.js                Menu mobile, anno nel footer, invio form
│   ├── analytics.js           Google Analytics 4 ed eventi tracciati (ID da configurare qui)
│   └── cookie-consent.js      Configurazione e testi del banner cookie
├── vendor/
│   └── cookieconsent/         Libreria CookieConsent 3.1.0 (non modificare: per aggiornarla sostituire i file)
├── img/
│   ├── cleopatra.jpg          Ritratto verticale 4:5 (segnaposto: sovrascrivere con lo stesso nome)
│   ├── og-image.jpg           Anteprima per WhatsApp/social, 1200×630
│   ├── favicon.svg            Icona del sito (anche logo nell'header)
│   ├── hero-cerchio.svg       Illustrazione della home
│   ├── elementi/              Icone dei 4 elementi + estate (terra, acqua, fuoco, aria, estate)
│   └── foto/                  Foto delle sessioni (oggi di repertorio, domani foto reali)
├── fonts/                     Fraunces e Nunito Sans in .woff2
├── docs/                      Documentazione interna: repository PRIVATO a parte, ignorato da git qui
├── CNAME                      Contiene: cleopatrasideri.it (lo crea GitHub quando si collega il dominio)
├── .nojekyll                  Dice a GitHub Pages di non elaborare i file
├── robots.txt
├── sitemap.xml
└── README.md                  Questo file
```

---

## Vedere il sito in locale

**Modo consigliato** (i percorsi e il form si comportano come online): da un terminale nella cartella del progetto

```bash
npm install     # solo la prima volta
npm run dev
```

Si apre il browser su <http://localhost:5173> (serve Node 20.19 o più recente). Per fermarlo: `Ctrl+C`. Vite serve solo da server di sviluppo: il sito non si compila.

**Ripiego senza Node:** doppio clic su `index.html`. Si apre nel browser e si può navigare, perché le pagine usano percorsi relativi; ma `404.html` (percorsi assoluti `/css/...`) si vede senza stile e il form non si comporta come online.

---

## Convenzioni

### Variabili CSS
Colori, font, dimensioni e spaziature sono definiti come custom properties in testa a `css/style.css`, dentro `:root { ... }`. Per cambiare un colore in tutto il sito si cambia **solo lì**. Evitare di scrivere colori "a mano" più in basso nel file.

### Sezioni commentate
Nell'HTML e nel CSS ogni blocco è introdotto da un commento con il suo nome (es. `<!-- SEZIONE: Cicli dei 4 elementi -->`). Usare la ricerca dell'editor (`Ctrl+F`) per trovarli.

### Header e footer duplicati
Non c'è un sistema di template: **header e footer sono copiati in ogni pagina**, delimitati da

```html
<!-- HEADER START --> ... <!-- HEADER END -->
<!-- FOOTER START --> ... <!-- FOOTER END -->
```

Se si modifica il menu, un contatto o il footer, **va fatto in tutte le pagine**. Il modo più sicuro: modificare il blocco in `index.html`, poi copiare tutto ciò che sta fra START ed END e incollarlo al posto del blocco corrispondente nelle altre pagine. (Attenzione solo alla voce di menu "attiva", che cambia da pagina a pagina.)

### Segnaposto
Tutto ciò che manca è marcato in due modi:

- un commento HTML: `<!-- DA COMPLETARE: descrizione -->`
- un testo visibile fra parentesi quadre, es. `[Nome ASD]`, `[Giorno e orario]`

Per trovarli tutti basta cercare **`DA COMPLETARE`** in tutti i file (in VS Code: `Ctrl+Shift+F`). L'elenco ragionato è in [docs/DA-COMPLETARE.md](docs/DA-COMPLETARE.md).

### Testi e contenuti
- Niente prezzi sul sito: si invita a "chiedere il listino della stagione".
- Mai promettere guarigioni né usare le parole "terapia" o "cura".
- Biodanza® è un marchio registrato dell'International Biodanza Foundation: titoli e formulazioni dei temi vanno concordati con la Scuola di Biodanza® dell'Adriatico.
- Nessun dato personale privato di Cleopatra (indirizzo di casa, data di nascita) deve comparire sul sito o nella documentazione.

---

## Voglio cambiare… → dove si fa

| Voglio cambiare… | File | Cosa cercare / cosa fare |
|---|---|---|
| Numero di telefono / WhatsApp | **Tutte** le pagine `.html` | Cercare `393286903680` (nei link `wa.me` e `tel:`) **e** `328 690 3680` (testo visibile). Sostituire entrambi ovunque |
| Email | Tutte le pagine `.html` | Cercare `sidercleo@gmail.com` (anche nei link `mailto:`) |
| Voci del menu | Tutte le pagine `.html` | Blocco fra `HEADER START` e `HEADER END` |
| Footer (associazione, contatti, link) | Tutte le pagine `.html` | Blocco fra `FOOTER START` e `FOOTER END` |
| Colori, font, spaziature | `css/style.css` | Blocco `:root` in cima al file |
| Icone del sito (scheda del browser, schermata home dello smartphone) | `img/favicon.svg`, `favicon.ico`, `img/apple-touch-icon.png`, `img/icon-*.png`, `site.webmanifest` | Se cambia il logo, rigenerare le PNG (180, 192, 512 px) e l'ICO partendo dall'SVG, ad esempio con realfavicongenerator.net |
| Sitemap | `sitemap.xml` | Elenca le pagine pubbliche. Se si aggiunge una pagina, aggiungere una riga `<url>`; quando si modifica una pagina, aggiornare la sua data `<lastmod>` |
| Testi dei cicli (Terra, Acqua, Fuoco, Aria, Biodanza al mare) | `index.html`, `biodanza-bambini.html` | Cercare il nome del ciclo, es. `Terra` |
| Ritratto di Cleopatra | `img/cleopatra.jpg` | Sostituire il file **con lo stesso nome**, formato verticale 4:5 (es. 800×1000 px), JPG sotto i 300 KB |
| Foto delle sessioni | `img/foto/` | Le foto sono in formato **WebP** (più leggero del JPG, supportato da tutti i browser attuali), **un solo file per foto**, largo 1280 px. Per sostituirne una: convertire la nuova foto in WebP (qualsiasi convertitore online gratuito, es. squoosh.app, qualità ~78) e salvarla **con lo stesso nome**; aggiornare `width`/`height` nell'HTML se cambiano le proporzioni. In alternativa si può usare un JPG cambiando l'estensione nell'`src`. Aggiornare la tabella [Crediti foto](#crediti-foto) e `privacy.html` |
| Testimonianze | `index.html` | Cercare `testimonianze`: sostituire i testi e **rimuovere l'attributo `hidden`** dalla sezione |
| Nome ASD/APS, sede, giorni e orari | Pagine Biodanza + footer di tutte le pagine | Cercare `DA COMPLETARE` e i testi fra `[ ]` |
| Chiave del form (Web3Forms) | Tutte le pagine con un form | Cercare `DA COMPLETARE: access_key` e incollare la chiave nel campo `value` |
| Pagina di ringraziamento | `grazie.html` | Testo libero |
| Informativa privacy | `privacy.html` | Va riletta se cambiano servizi (form, statistiche) |
| Anteprima quando si condivide il link | `img/og-image.jpg` + tag `og:image` nelle pagine | Immagine 1200×630 px |
| Statistiche (ID di Google Analytics, eventi, testo del banner) | `js/analytics.js` | Variabile `GA_MEASUREMENT_ID` in cima al file; l'elenco degli eventi tracciati è nel commento iniziale. Se cambia cosa si traccia, aggiornare la sezione 6 di `privacy.html` |

Dopo una modifica a più pagine, controllare sempre con una ricerca globale di non averne dimenticata nessuna.

---

## Come pubblicare una modifica

Il sito si pubblica da solo: **ogni commit sul branch `main` aggiorna il sito online in 1–2 minuti.**

### Senza installare nulla (editor web di GitHub)
1. Entrare su GitHub con l'account del sito e aprire il repository.
2. Aprire il file da modificare e cliccare sull'icona della matita (*Edit this file*).
   In alternativa premere il tasto **`.`** (punto) sulla pagina del repository: si apre un editor completo nel browser (github.dev), utile per modifiche su più file.
3. Fare le modifiche, poi **Commit changes** scrivendo una breve descrizione (es. "Aggiornati orari stagione 2027/28").
4. Per sostituire un'immagine: entrare nella cartella (es. `img/`), *Add file → Upload files*, caricare il file con **lo stesso nome**, commit.
5. Attendere 1–2 minuti e ricaricare il sito (se non cambia: `Ctrl+F5` o finestra in incognito).

### Con git in locale
<a id="lavorare-in-locale"></a>
Sono **due repository**: il sito (pubblico) e `docs/` (privato), clonato dentro la cartella del sito.

Su un computer nuovo:
```bash
git clone https://github.com/<utente>/<utente>.github.io.git cleopatra-sideri
git clone https://github.com/<utente>/cleopatra-sideri-docs.git cleopatra-sideri/docs
```

Ogni volta che si riprende il lavoro, e per pubblicare:
```bash
git pull; git -C docs pull          # aggiorna entrambi
# modifiche...
git add .
git commit -m "Descrizione della modifica"
git push                             # pubblica il sito
git -C docs add . && git -C docs commit -m "..." && git -C docs push   # solo se hai cambiato docs/
```

Il file `.ignore` nella radice serve a far trovare `docs/` alle ricerche di VS Code e degli agenti AI, che altrimenti salterebbero le cartelle ignorate da git.

Lo stato della pubblicazione si vede nella scheda **Actions** del repository (pallino verde = pubblicato).

---

## Servizi esterni

| Servizio | A cosa serve | Dove si configura | Note |
|---|---|---|---|
| GitHub Pages | Ospita il sito | Repository → Settings → Pages | Dominio personalizzato + "Enforce HTTPS" |
| Registrar del dominio | `cleopatrasideri.it` e DNS | Pannello del registrar | Intestato a Cleopatra, rinnovo automatico. Vedi [HOSTING-E-DOMINIO](docs/HOSTING-E-DOMINIO.md) |
| Web3Forms | Riceve i messaggi dei form e li inoltra per email a sidercleo@gmail.com | <https://web3forms.com> | Campo nascosto `access_key`; honeypot `botcheck`; redirect a `https://cleopatrasideri.github.io/grazie.html` (poi `https://cleopatrasideri.it/grazie.html`). Il piano gratuito ha un limite mensile di invii: verificarlo sul sito |
| Google Analytics 4 | Statistiche: visite, clic su WhatsApp/telefono/email, invii del modulo, sezioni lette | <https://analytics.google.com> | Proprietà intestata a Cleopatra. ID in `js/analytics.js`. Vedi sotto |
| Google Business Profile | Farsi trovare su Google Maps / ricerca locale | <https://business.google.com> | Non tocca il codice del sito |
| WhatsApp Business | Gestione contatti | App sul telefono di Cleopatra | Non tocca il codice del sito |

### Google Analytics 4 e consenso

Tutto sta in **`js/analytics.js`**, incluso in ogni pagina dopo `main.js`:

- **ID:** variabile `GA_MEASUREMENT_ID` in cima al file (formato `G-XXXXXXXXXX`). Finché resta il segnaposto, GA non si carica.
- **Consenso:** gestito dalla libreria **CookieConsent** (configurazione e testi in `js/cookie-consent.js`, [documentazione](https://cookieconsent.orestbida.com)). Al primo accesso compare il banner "Accetta / Rifiuta / Scegli"; GA viene caricato **solo se si accettano le "Statistiche"**. La scelta è salvata nel cookie tecnico `cc_cookie` per 6 mesi e si cambia dal link **"Preferenze cookie"** nel footer (qualsiasi elemento con `data-cc="show-preferencesModal"`). Se si aggiunge un servizio con cookie, aggiungere la categoria in `js/cookie-consent.js`, aumentare `revision` e aggiornare `privacy.html`.
- **In locale** (localhost o file aperto dal disco) GA non viene mai caricato: gli eventi vengono scritti nella **console del browser** (F12 → Console, righe `[analytics]`), utile per verificarli.
- **Eventi personalizzati:** `whatsapp_click`, `phone_click`, `email_click`, `generate_lead` (invio riuscito del modulo, conversione principale), `form_error`, `cta_click`, `menu_click`, `select_content` (card dei percorsi), `faq_open`, `section_view`, `scroll_depth`, `page_not_found`. Il parametro `posizione` dice da quale sezione è partito il clic (es. `hero`, `contatti`, `barra_mobile`).
- **Da configurare nel pannello GA4** (Amministrazione): conservazione dati **14 mesi**; **Google signals disattivati**; segnare come **eventi chiave** `generate_lead`, `whatsapp_click`, `phone_click`; registrare come **dimensioni personalizzate** (ambito evento) i parametri `posizione`, `testo`, `sezione`, `domanda`, `interesse`, così si possono usare nei report.

---

## Crediti foto

Le foto in `img/foto/` sono **immagini di repertorio da Pixabay**, scelte in attesa delle foto reali dei gruppi di Cleopatra. La [Pixabay Content License](https://pixabay.com/service/license-summary/) **non richiede attribuzione**, ma teniamo comunque traccia di autore e fonte, qui e nella pagina `privacy.html` (sezione "Crediti fotografici"). Se si sostituisce una foto, aggiornare entrambi. Per cercarne di nuove c'è la chiave API in `.env.local` (esclusa da git).

Le foto reali delle sessioni vanno usate **solo con liberatoria firmata** dalle persone riconoscibili (modello in [docs/STRATEGIA-CONTATTI.md](docs/STRATEGIA-CONTATTI.md)).

| File | Autore | Fonte | Licenza |
|---|---|---|---|
| `img/foto/gruppo-prato.webp` | AdinaVoicu | [Pixabay](https://pixabay.com/photos/goose-friendliness-friend-joy-love-1339234/) | Pixabay Content License |
| `img/foto/cerchio-piedi-nudi.webp` | carlosccr | [Pixabay](https://pixabay.com/photos/feet-people-team-person-foot-spa-2191155/) | Pixabay Content License |
| `img/foto/danza-libera.webp` | 1857643 | [Pixabay](https://pixabay.com/photos/woman-frolicking-meadow-freedom-6724707/) | Pixabay Content License |
| `img/foto/bambini-danza.webp` | 2147792 | [Pixabay](https://pixabay.com/photos/mama-children-to-dance-fun-family-5098862/) | Pixabay Content License |
| `img/og-image.jpg` | derivata da `danza-libera.webp` | — | Pixabay Content License (con testo sovrapposto) |
| `img/cleopatra.jpg` | segnaposto generato | — | da sostituire con la foto vera |
| `img/*.svg`, `img/elementi/*.svg` | realizzate per questo sito | — | — |

---

## Altri documenti

| Documento | Per chi | Contenuto |
|---|---|---|
| [AGENTS.md](AGENTS.md) | Agenti AI (Claude Code, Codex, Cursor…) e sviluppatori | Regole tecniche e di contenuto del progetto, verifiche prima di consegnare. `CLAUDE.md` si limita a importarlo |
| [docs/HOSTING-E-DOMINIO.md](docs/HOSTING-E-DOMINIO.md) | Tecnico | Messa online passo passo, DNS, passaggio di consegne |
| [docs/GUIDA-CLEOPATRA.md](docs/GUIDA-CLEOPATRA.md) | Cleopatra | Cosa possiede, cosa costa, cosa fare ogni anno |
| [docs/STRATEGIA-CONTATTI.md](docs/STRATEGIA-CONTATTI.md) | Cleopatra e tecnico | Come trasformare i contatti in iscritti, messaggi WhatsApp pronti |
| [docs/PACCHETTI-PREZZI.md](docs/PACCHETTI-PREZZI.md) | Cleopatra | Proposta di listino, agevolazioni, calendario della stagione |
| [docs/DA-COMPLETARE.md](docs/DA-COMPLETARE.md) | Tutti | Checklist prima della pubblicazione |
| [docs/EVOLUTIVE.md](docs/EVOLUTIVE.md) | Tecnico | Idee per il futuro, con pro, contro e complessità |

## Evolutive

Il sito è volutamente essenziale. Le idee per il futuro (bacheca settimanale aggiornabile da Cleopatra, galleria foto, video, newsletter, versione inglese, calendario delle serate aperte…) sono raccolte e valutate in [docs/EVOLUTIVE.md](docs/EVOLUTIVE.md). Prima di aggiungere complessità, chiedersi: *chi la manterrà fra un anno?*
