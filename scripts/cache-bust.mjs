// Aggiunge ?v=<hash> agli URL di CSS e JS locali nelle pagine HTML, così il browser
// scarica di nuovo il file solo quando cambia (GitHub Pages li tiene in cache 10 minuti).
//   npm run cache-bust          riscrive le pagine
//   npm run cache-bust:check    non scrive; esce con errore se qualche ?v= è mancante o vecchio
// Solo moduli di Node: nessuna dipendenza. Si ignora vendor/ (CookieConsent non si modifica)
// e tutto ciò che è esterno (Google Analytics).
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

// <link ... href="..."> e <script ... src="..."> con un file .css / .js, eventualmente con ?v=...
const tag = /(<(?:link|script)\b[^>]*?\b(?:href|src)=")([^"#?]+\.(?:css|js))(?:\?v=[^"]*)?(")/g;

// Si ignorano i ritorni a capo CR: su Windows git può convertirli e l'hash cambierebbe da computer a computer.
function hash(file) {
  const content = readFileSync(file).toString("latin1").replace(/\r/g, "");
  return createHash("sha1").update(content, "latin1").digest("hex").slice(0, 8);
}

let outdated = 0;
for (const page of readdirSync(root).filter((f) => f.endsWith(".html"))) {
  const original = readFileSync(join(root, page), "utf8");
  const updated = original.replace(tag, (whole, before, url, after) => {
    if (/^(?:[a-z]+:)?\/\//i.test(url) || url.replace(/^\//, "").startsWith("vendor/")) return whole;
    const file = join(root, url.replace(/^\//, ""));
    if (!existsSync(file)) return whole;
    return `${before}${url}?v=${hash(file)}${after}`;
  });
  if (updated === original) continue;
  outdated++;
  if (checkOnly) console.log(`da aggiornare: ${page}`);
  else {
    writeFileSync(join(root, page), updated);
    console.log(`aggiornato: ${page}`);
  }
}

if (checkOnly && outdated) {
  console.error("Esegui: npm run cache-bust");
  process.exit(1);
}
if (!outdated) console.log("Niente da aggiornare.");
