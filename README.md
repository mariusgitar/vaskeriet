# PII Scrubber (minimal, statisk)

En liten anonymiseringsapp som kjører **100% lokalt i nettleseren**. Ingen data sendes til server.

## PR3 scope (Pages deploy + polish)
- Ren HTML/CSS/JS uten build-step.
- Støtte for `.txt` og `.csv` med lokal anonymisering i browser.
- Side-by-side preview (før/etter), avkortet til maks 20k tegn.
- Pseudonymisering/maskering, debug-toggle og self-check.
- GitHub Pages deploy-workflow på push til `main`.
- Deploy av statisk innhold direkte fra `web/`.
- `.nojekyll` inkludert for stabil statisk hosting.

## Kjøring lokalt
1. Åpne `web/index.html` i nettleser.
2. Last opp `web/fixtures/sample.txt` eller `web/fixtures/sample.csv`.
3. Trykk **Anonymiser**.
4. Trykk **Last ned**.

## Deploy (GitHub Pages)
Workflow: `.github/workflows/pages.yml`.

- Trigger: push til `main`.
- Artifact: `./web` lastes opp og deployes.
- Krav i repo settings:
  1. `Settings` → `Pages`.
  2. Source: **GitHub Actions**.

## Testkriterier (PR3)
- Etter merge til `main` kjører workflow automatisk.
- GitHub Pages-lenken viser appen.
- `sample.txt` og `sample.csv` fungerer i Pages-miljø.

## Feilsøking (kort)
- Hvis workflow feiler: sjekk at Pages source er satt til **GitHub Actions**.
- Hvis app ikke oppdateres: verifiser siste run i Actions-fanen og åpne ny incognito-fane.
- Hvis CSV ser feil ut etter eksport: sjekk input med anførselstegn/komma.
- Skru på **Debug** for konsoll-logger.

## Security / Privacy
- Ingen `fetch`, XHR eller WebSocket for databehandling.
- Ingen eksterne CDN-avhengigheter.
- Data behandles kun i browser-minnet.

Se også [`SECURITY.md`](SECURITY.md).

## Next PR plan
- Ingen planlagte funksjonsendringer nå; fokus på vedlikehold, bugfixes og eventuelle regex-forbedringer.
