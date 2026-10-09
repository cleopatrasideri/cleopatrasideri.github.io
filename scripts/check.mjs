// Controlli automatici da lanciare prima di ogni pubblicazione, con qualsiasi strumento.
//   npm run check            controlli del repository (veloce, offline)
//   npm run check:lancio     in più, i segnaposto e gli strumenti temporanei devono essere spariti
//   npm run check:w3c        in più, validazione HTML sul validatore W3C (serve internet)
// Esce con errore (1) se trova problemi. Solo moduli di Node: nessuna dipendenza.
//
// Controlli: link interni e ancore, header/footer uguali in tutte le pagine, parole vietate
// (vedi AGENTS.md), colori fuori da :root, foto non WebP o con srcset, ?v= della cache.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lancio = process.argv.includes("--lancio");
const w3c = process.argv.includes("--w3c");

const pages = readdirSync(root).filter((f) => f.endsWith(".html"));
const read = (f) => readFileSync(join(root, f), "utf8");
const html = Object.fromEntries(pages.map((p) => [p, read(p)]));

let errors = 0;
let warnings = 0;
const section = (title) => console.log(`\n${title}`);
const fail = (msg) => { errors++; console.log(`  ✗ ${msg}`); };
const warn = (msg) => { warnings++; console.log(`  ! ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

// ---------------------------------------------------------------- link interni
section("Link interni");
const ids = Object.fromEntries(pages.map((p) => [p, new Set([...html[p].matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))]));
const attr = /<[^>]+?\b(href|src|poster)="([^"]*)"/g;
let links = 0;
let badLinks = 0;
for (const page of pages) {
  for (const m of html[page].matchAll(attr)) {
    const url = m[2].trim();
    if (!url || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) continue; // http, mailto, tel, data...
    links++;
    const [pathAndQuery, fragment] = url.split("#");
    const path = pathAndQuery.split("?")[0];
    let target;
    if (path === "") target = page; // solo #ancora
    else if (path.startsWith("/")) target = path.slice(1) || "index.html";
    else target = posix.normalize(posix.join(posix.dirname(page), path));
    if (target.endsWith("/")) target += "index.html";
    const where = `${page}:${lineOf(html[page], m.index)}`;
    if (!existsSync(join(root, target))) {
      fail(`${where}  ${m[1]}="${url}" → file inesistente`);
      badLinks++;
    } else if (fragment && target.endsWith(".html") && !ids[target]?.has(fragment)) {
      fail(`${where}  ${m[1]}="${url}" → ancora "#${fragment}" inesistente in ${target}`);
      badLinks++;
    }
  }
}
if (!badLinks) ok(`${links} link/risorse locali verificati in ${pages.length} pagine`);

// ---------------------------------------------------------------- header e footer
section("Header e footer uguali in tutte le pagine");
// 404.html usa percorsi assoluti (/css/...), le altre pagine relativi; la voce attiva del menu può variare.
const normalize = (s) => s
  .replace(/\b(href|src)="\//g, '$1="')
  .replace(/\s*aria-current="page"/g, "")
  .replace(/\s+/g, " ")
  .trim();
for (const name of ["HEADER", "FOOTER"]) {
  const block = new RegExp(`<!-- ${name} START[^>]*-->([\\s\\S]*?)<!-- ${name} END`);
  const variants = new Map();
  for (const page of pages) {
    const m = html[page].match(block);
    if (!m) { fail(`${page}: manca il blocco ${name} START/END`); continue; }
    const key = normalize(m[1]);
    variants.set(key, [...(variants.get(key) ?? []), page]);
  }
  if (variants.size === 1) ok(`${name} identico in ${pages.length} pagine`);
  else if (variants.size > 1) {
    const groups = [...variants.values()].map((g) => g.join(", ")).join("  |  ");
    fail(`${name} diverso fra le pagine: ${groups}`);
  }
}

// ---------------------------------------------------------------- parole vietate
section("Regole di contenuto (parole vietate)");
// `allow`: righe in cui la parola è legittima (disclaimer, curriculum, frase della bio).
const disclaimer = /non sostitu|sostituiscono|non una cura|mai prenderne|affiancare|seguendo una terapia|stai seguendo/i;
const curriculum = /Includi Salute|progetti per la terza età|persone anziane|Comune di Pescara/i;
const rules = [
  { name: "terza età / anziani / over 65", re: /terza et[àa]|anzian[oi]|over ?65|\bsenior\b/gi, allow: curriculum },
  { name: "facilitatrice titolata", re: /facilitator[ei]?\w*|titolat[ao]/gi },
  { name: "promessa sanitaria (cura/terapia/guarigione)", re: /\bterapi[ae]\b|\bcur[ae]\b|\bcurare\b|\bguar(?:isc\w*|ig\w*|ire|it[aoei])\b/gi, allow: disclaimer },
  { name: "sessualità / trascendenza", re: /sessualit[àa]|trascendenz\w*/gi },
  { name: "prezzo in cifre", re: /€|\beuro\b|\d\s?eur\b|\bEUR\b/gi },
  { name: "immagine generata con l'AI", re: /ai[ -]generated/gi },
];
let wordHits = 0;
for (const page of pages) {
  const lines = html[page].split("\n");
  lines.forEach((line, i) => {
    for (const rule of rules) {
      if (rule.allow?.test(line)) continue;
      for (const m of line.matchAll(rule.re)) {
        wordHits++;
        const around = line.trim().slice(Math.max(0, m.index - 40), m.index + 40);
        fail(`${page}:${i + 1}  ${rule.name}: "${m[0]}"  …${around}…`);
      }
    }
  });
}
if (!wordHits) ok("nessuna parola vietata fuori da disclaimer e curriculum");
console.log("    (eccezioni ammesse: frasi dei disclaimer e righe del curriculum, definite in scripts/check.mjs)");

// ---------------------------------------------------------------- CSS
section("CSS");
const css = read("css/style.css");
// Il contenuto di :root si sostituisce con spazi (tenendo gli a capo) per non perdere i numeri di riga.
const masked = css.replace(/:root\s*\{[^}]*\}/g, (r) => r.replace(/[^\n]/g, " "));
const colors = [...masked.matchAll(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\(/gi)];
if (colors.length) {
  // Avviso e non errore: ci sono già colori a mano (soprattutto #fff) da portare in :root.
  const lines = [...new Set(colors.map((m) => lineOf(masked, m.index)))];
  warn(`css/style.css: ${colors.length} colori fuori da :root (righe ${lines.join(", ")})`);
} else ok("nessun colore fuori da :root");
// Su una riga come `color-mix(in srgb, var(--x) 80%, #fff)` il #fff sarebbe comunque segnalato: è voluto.

// ---------------------------------------------------------------- foto
section("Foto");
const fotoDir = join(root, "img", "foto");
if (existsSync(fotoDir)) {
  const bad = readdirSync(fotoDir).filter((f) => statSync(join(fotoDir, f)).isFile() && !f.endsWith(".webp"));
  if (bad.length) bad.forEach((f) => fail(`img/foto/${f} non è WebP`));
  else ok("img/foto contiene solo WebP");
}
for (const page of pages) {
  if (/\bsrcset=/.test(html[page])) fail(`${page}: usa srcset (una foto = un solo file)`);
  for (const m of html[page].matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) fail(`${page}:${lineOf(html[page], m.index)}  <img> senza alt`);
  }
}

// ---------------------------------------------------------------- cache
section("Cache degli asset (?v=)");
const cache = spawnSync(process.execPath, [join(root, "scripts", "cache-bust.mjs"), "--check"], { encoding: "utf8" });
if (cache.status === 0) ok("tutti gli ?v= sono aggiornati");
else fail(`${cache.stdout.trim().replace(/\n/g, "; ")} → lancia: npm run cache-bust`);

// ---------------------------------------------------------------- segnaposto e strumenti temporanei
section(lancio ? "Prima del lancio (devono essere spariti)" : "Prima del lancio (solo informativo; usa --lancio per renderlo bloccante)");
const publishable = [...pages, "robots.txt", "sitemap.xml"].filter((f) => existsSync(join(root, f)));
const pending = [
  { name: "DA COMPLETARE", re: /DA COMPLETARE/g, files: pages },
  { name: "testo provvisorio [..] (class=\"todo\")", re: /class="todo"/g, files: pages },
  { name: "STRUMENTO TEMPORANEO", re: /STRUMENTO TEMPORANEO/g, files: pages },
  { name: "ANTEPRIMA (noindex)", re: /ANTEPRIMA/g, files: pages.filter((p) => !["404.html", "grazie.html"].includes(p)) },
  { name: "indirizzo provvisorio cleopatrasideri.github.io", re: /cleopatrasideri\.github\.io/g, files: publishable },
];
for (const item of pending) {
  const found = item.files.map((f) => [f, [...read(f).matchAll(item.re)].length]).filter(([, n]) => n);
  const total = found.reduce((s, [, n]) => s + n, 0);
  if (!total) { ok(`${item.name}: nessuno`); continue; }
  const detail = found.map(([f, n]) => `${f} (${n})`).join(", ");
  (lancio ? fail : (m) => console.log(`  · ${m}`))(`${item.name}: ${total} → ${detail}`);
}
for (const extra of ["img/candidati", "js/scegli-foto.js"]) {
  if (!existsSync(join(root, extra))) { ok(`${extra}: rimosso`); continue; }
  (lancio ? fail : (m) => console.log(`  · ${m}`))(`${extra} è ancora presente`);
}

// ---------------------------------------------------------------- W3C (opzionale)
if (w3c) {
  section("Validazione HTML W3C");
  for (const page of pages) {
    try {
      const res = await fetch("https://validator.w3.org/nu/?out=json", {
        method: "POST",
        headers: { "Content-Type": "text/html; charset=utf-8", "User-Agent": "controlli-sito-cleopatrasideri" },
        body: html[page],
      });
      const { messages = [] } = await res.json();
      const errs = messages.filter((m) => m.type === "error");
      const warns = messages.filter((m) => m.type === "info" && m.subType === "warning");
      if (!errs.length && !warns.length) ok(page);
      errs.forEach((m) => fail(`${page}:${m.lastLine ?? "?"}  ${m.message}`));
      warns.forEach((m) => warn(`${page}:${m.lastLine ?? "?"}  ${m.message}`));
    } catch (e) {
      warn(`${page}: validatore non raggiungibile (${e.message})`);
    }
    await new Promise((r) => setTimeout(r, 1000)); // gentili col servizio pubblico
  }
}

// ---------------------------------------------------------------- esito
console.log(`\n${errors ? "✗" : "✓"} ${errors} errori, ${warnings} avvisi`);
process.exit(errors ? 1 : 0);
