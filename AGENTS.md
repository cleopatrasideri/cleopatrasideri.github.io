# AGENTS.md — Sito di Cleopatra Sideri

Istruzioni per gli agenti di programmazione (Claude Code, Codex, Cursor, Copilot…) e promemoria per chiunque lavori al progetto. Per i dettagli leggere anche [README.md](README.md) e la cartella [docs/](docs/).

## Il progetto in breve
Sito vetrina statico di **Cleopatra Sideri** (Montesilvano, PE): Biodanza per **adulti** e per **bambini e ragazzi**, più trattamenti e corsi di **Reiki**. Obiettivo: dare credibilità a chi arriva dal passaparola, rendere la Biodanza accessibile e portare le persone alla **prima serata gratuita** (contatto principale: WhatsApp).

Il sito appartiene a Cleopatra, che non ha competenze tecniche: deve poter essere mantenuto da chiunque, con aggiornamenti circa una volta l'anno. Chi ci lavora oggi potrebbe non esserci domani.

## Regole tecniche (non negoziabili)
- **HTML5 + un solo `css/style.css` + JavaScript vanilla minimo. Zero build, zero framework, nessuna dipendenza nel sito.** Tailwind e simili sono stati scartati di proposito. Unica eccezione: **`vite` come devDependency**, solo per il server locale (`npm run dev`). Vietati `vite build`, plugin e altri pacchetti.
- **Cache degli asset**: GitHub Pages tiene CSS e JS in cache 10 minuti, quindi nelle pagine gli URL hanno `?v=<hash>` (es. `css/style.css?v=252749c0`). Non scriverli a mano: dopo ogni modifica a `css/` o `js/` lanciare **`npm run cache-bust`** (script `scripts/cache-bust.mjs`, solo Node, nessuna dipendenza; la skill `/push` lo fa da sola). `vendor/` è escluso. Nelle pagine nuove basta scrivere l'URL senza `?v=` e lanciare lo script.
- Colori, font e spaziature solo come **custom properties in `:root`**; niente colori "a mano" nel resto del CSS.
- **Header e footer sono duplicati** in ogni pagina tra `<!-- HEADER START/END -->` e `<!-- FOOTER START/END -->`: ogni modifica va riportata in **tutte** le pagine. `404.html` usa **percorsi assoluti** (`/css/...`).
- Sezioni HTML marcate con `<!-- SEZIONE: Nome -->`. Segnaposto: commento `<!-- DA COMPLETARE: ... -->` + testo visibile `<span class="todo">[...]</span>`, elencati in [docs/DA-COMPLETARE.md](docs/DA-COMPLETARE.md).
- **Foto: un solo file WebP per foto** in `img/foto/` (1280 px), niente `srcset` o varianti multiple (trappola per chi sostituisce un file). `og-image.jpg` e `cleopatra.jpg` restano JPG.
- **Niente immagini generate con l'AI** spacciate per reali (su Pixabay scartare quelle con tag "ai generated"). Le foto vere arriveranno da Cleopatra.
- Banner cookie: libreria **CookieConsent 3.1.0** in `vendor/cookieconsent/` (**non modificare**), configurata in `js/cookie-consent.js`. Statistiche: **Google Analytics 4** in `js/analytics.js`, caricato **solo dopo il consenso**; l'ID va solo lì.
- Accessibilità e qualità: contrasto WCAG AA (usare i token colore esistenti), HTML valido W3C, Lighthouse SEO/Accessibilità/Best practices a 100.
- `.env.local` contiene la chiave API Pixabay: è escluso da git, **non va mai mostrato né committato**. (`.env` invece sarebbe versionato.)
- Repository pubblico (GitHub Pages gratuito): nessun dato sensibile nei file. Documentazione interna, prezzi e strategia vanno in `docs/`, che è privato.

## Regole di contenuto
- Lingua **italiano**, tono **"tu"**, caldo e semplice. Niente gergo tecnico della Biodanza nei testi pubblici.
- **Cleopatra è tirocinante**: "Insegnante di Biodanza in formazione" (Scuola di Biodanza® dell'Adriatico) e "Istruttrice nazionale AICS – metodo Biodanza". **Mai** "facilitatrice titolata". Biodanza® è marchio dell'International Biodanza Foundation.
- **Niente offerta per la terza età** (Cleopatra non ha le certificazioni): nessuna pagina, gruppo, agevolazione over 65 o voce di menu. Restano solo, come curriculum, le esperienze passate (volontariato Comune di Pescara, progetto "Includi Salute" 2025, frase della bio). Le frasi generiche sull'età ("Per ogni età") vanno bene.
- **Nessuna promessa sanitaria**: mai "cura", "terapia", "guarisce" (se non per negarlo nei disclaimer). Non nominare le linee "sessualità" e "trascendenza".
- **Prezzi mai in cifre sul sito**: "chiedimi il listino della stagione". I prezzi indicativi stanno in [docs/PACCHETTI-PREZZI.md](docs/PACCHETTI-PREZZI.md).
- **Dati personali da non pubblicare**: indirizzo di casa e data di nascita di Cleopatra, documenti di terzi presenti nel suo curriculum (es. la lettera della pediatra), attestati non pertinenti (es. difesa personale).
- Offerta: **"Il percorso dei 4 elementi"**, cicli di **8 incontri da 90–120 minuti** (durata volutamente flessibile per favorire il rilassamento): Terra (autunno), Acqua (inverno), Fuoco (fine inverno), Aria (primavera); d'estate "Biodanza al mare". Serata aperta gratuita a inizio ciclo, ingresso possibile anche a ciclo iniziato. Niente abbonamenti lunghi.

## Dove si scrivono le informazioni
> **`docs/` è un repository privato separato** (`cleopatra-sideri-docs`, account GitHub di Cleopatra), clonato dentro la cartella `docs/` e ignorato dal repository del sito, che è pubblico. Se `docs/` manca, va clonato (comandi nel [README](README.md#lavorare-in-locale)), non ricreato. Dopo aver modificato file in `docs/` fare commit e push **anche lì** (`git -C docs ...`). Non spostare in `docs/` niente che serva al sito.

Tutto ciò che riguarda il progetto va scritto **in file markdown del repository**, non in memorie o impostazioni personali dello strumento:
- regole e decisioni stabili → questo `AGENTS.md`;
- cose mancanti prima della pubblicazione → [docs/DA-COMPLETARE.md](docs/DA-COMPLETARE.md);
- idee e sviluppi futuri (sezione "Appunti" in cima) → [docs/EVOLUTIVE.md](docs/EVOLUTIVE.md);
- hosting, dominio, servizi → [docs/HOSTING-E-DOMINIO.md](docs/HOSTING-E-DOMINIO.md);
- strategia contatti e messaggi WhatsApp → [docs/STRATEGIA-CONTATTI.md](docs/STRATEGIA-CONTATTI.md);
- guida non tecnica per Cleopatra → [docs/GUIDA-CLEOPATRA.md](docs/GUIDA-CLEOPATRA.md).

## Modo di lavorare
- Rispondere in italiano.
- Se la richiesta è ambigua, **fare domande di chiarimento prima di pianificare**; poi implementare in un unico passaggio.
- Essere critici e onesti: segnalare rischi e alternative migliori, anche se contraddicono la richiesta.
- Non dichiarare finito un lavoro senza averlo verificato (vedi sotto).
- **Mai fare `git commit` o `git push` di propria iniziativa**, né nel repository del sito né in `docs/`: li fa sempre chi mantiene il sito. Solo se lo chiede esplicitamente, e solo per quella volta (in Claude Code lanciare `/push` equivale a chiederlo: fa commit e push dei due repository). A fine lavoro elencare i file modificati, così può rivederli e fare commit e push.

## Verifiche prima di consegnare
- **Vedere il sito**: `npm run dev` nella cartella del progetto (la prima volta `npm install`); si apre da solo il browser su <http://localhost:5173>. Controllare desktop e smartphone (375 px).
- **HTML valido**: validatore W3C (<https://validator.w3.org/nu/>), anche via API: `curl -H "Content-Type: text/html; charset=utf-8" --data-binary @pagina.html "https://validator.w3.org/nu/?out=json"`.
- **Qualità**: `npx lighthouse http://localhost:8000/pagina.html` (le prestazioni in locale sono più basse che online: il server di prova non comprime i file).
- **Link interni**: nessun `href`/`src` verso file inesistenti.
- **Cache degli asset**: `npm run cache-bust:check` deve uscire senza errori (altrimenti `npm run cache-bust`).
- **Regole di contenuto**: cercare nel sito parole vietate ("terza età" fuori dal curriculum, "facilitatrice titolata", "terapia" fuori dai disclaimer, prezzi in cifre).
- Le statistiche in locale non partono: gli eventi compaiono nella console del browser (righe `[analytics]`).

## Strumenti temporanei da rimuovere prima della pubblicazione
- Selettore foto: `img/candidati/`, `js/scegli-foto.js` e le righe marcate `STRUMENTO TEMPORANEO` nelle pagine (procedura in [docs/DA-COMPLETARE.md](docs/DA-COMPLETARE.md)).
- Anteprima nascosta ai motori di ricerca: righe marcate `ANTEPRIMA` (`<meta name="robots" content="noindex">`) in `index.html`, `biodanza-bambini.html`, `reiki.html`, `privacy.html`. Finché ci sono, Lighthouse SEO non arriva a 100: è previsto. In `404.html` e `grazie.html` il `noindex` invece è definitivo.
- Bozze SEO per il go-live in `docs/seo-golive/` (`robots.txt` con i crawler AI, `llms.txt`): **non** sono ancora nel sito, che resta invisibile fino al lancio. Al lancio vanno copiate nella radice (procedura nel punto "Rendere il sito visibile a Google" di [docs/DA-COMPLETARE.md](docs/DA-COMPLETARE.md)). Le pagine hanno già `FAQPage`/`BreadcrumbList`: se si modifica il testo di una FAQ visibile, aggiornare anche il JSON-LD.
- Indirizzo provvisorio `cleopatrasideri.github.io` al posto di `cleopatrasideri.it` (procedura "Tornare al dominio vero" in [docs/DA-COMPLETARE.md](docs/DA-COMPLETARE.md)).
