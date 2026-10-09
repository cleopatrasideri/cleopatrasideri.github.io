---
name: push
description: Fa commit e push del repository del sito e di quello privato docs/ (cleopatra-sideri-docs). Solo su richiesta esplicita dell'utente (/push).
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git log:*), Bash(git -C docs status:*), Bash(git -C docs diff:*), Bash(git -C docs add:*), Bash(git -C docs commit:*), Bash(git -C docs push:*), Bash(git -C docs log:*)
---

# /push — commit e push di entrambi i repository

Il progetto ha **due repository git separati** (vedi AGENTS.md): il sito (pubblico, cartella principale) e `docs/` (privato, `cleopatra-sideri-docs`). Questa skill committa e fa il push di entrambi.

Poiché l'utente ha lanciato `/push`, commit e push sono esplicitamente richiesti, ma solo per questa volta.

## Procedura
Per ciascun repository (`git ...` per il sito, `git -C docs ...` per docs):

1. `status --short --branch` e `diff --stat`. Se non c'è niente da committare né da inviare (`log @{u}..HEAD --oneline` vuoto), dirlo e passare oltre.
2. **Controllo di sicurezza prima di committare** (soprattutto per il sito, che è pubblico): leggere l'elenco dei file e fermarsi, chiedendo conferma, se compare qualcosa che sembra un segreto o un dato personale (`.env*`, chiavi, token, indirizzo di casa o data di nascita di Cleopatra, documenti di terzi, `node_modules/`). `.env.local` è ignorato da git: non deve mai comparire.
3. Se ci sono modifiche, `git add -A` e **un commit** con messaggio in italiano, breve e descrittivo (una riga, stile dei commit esistenti: guardare `git log --oneline -5`), scritto leggendo il diff. Nel sito terminare il messaggio con la riga di attribuzione indicata dal sistema (`Co-Authored-By: ...`). Mai `--no-verify`, mai `--amend`.
4. `git push`. Mai `--force`, mai cambiare branch o remoto. Se il push è rifiutato (branch indietro rispetto al remoto), fermarsi e riferire l'errore: niente pull/rebase automatici.
5. Se `docs/` manca, dirlo e fare solo il sito (non ricreare `docs/`: va clonato, vedi README).

Ordine: prima `docs/`, poi il sito; se uno dei due fallisce, riferirlo e proseguire con l'altro solo se non dipende da quello.

## Risposta finale
Per ciascun repository, una riga: titolo del commit creato e push riuscito, oppure "niente da inviare". In italiano.
