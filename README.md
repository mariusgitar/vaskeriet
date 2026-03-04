# PII Scrubber (minimal, statisk)

En liten anonymiseringsapp som kjører **100% lokalt i nettleseren**. Ingen data sendes til server.

## Features
- Ren HTML/CSS/JS uten build-step.
- Drag & drop + filvelger for `.txt` og `.csv` (automatisk støtte for komma- og semikolon-separert CSV (delimiter auto-detect)).
- Side-by-side preview (før/etter), avkortet til maks 20k tegn.
- Regler for anonymisering:
  - Email → `[EMAIL]`
  - Norsk telefonnummer → `[PHONE]`
  - Fødselsnummer (11 siffer med enkel plausibilitet dd/mm) → `[FNR]`
- CSV: header-basert anonymisering av navnkolonner (`navn`, `fornavn`, `etternavn`, `name`, `first_name`, `last_name`, `full_name`, m.fl.).
  - Maskering: `[NAME]`
  - Pseudonymisering: `[NAME_1]`, `[NAME_2]`, ...
- Valgfri pseudonymisering i UI (`[EMAIL_#]`, `[PHONE_#]`, `[FNR_#]`, `[NAME_#]`).
- CSV-anonymisering av øvrige celler (header kan anonymiseres via checkbox).
- Last ned anonymisert output (`.txt` og `.csv`).
- Debug-toggle + self-check-knapp.

## Kjøring lokalt
1. Åpne `web/index.html` i nettleser.
2. Last opp `web/fixtures/sample.txt`, `web/fixtures/sample.csv` eller `web/fixtures/sample_semicolon.csv`.
3. Trykk **Anonymiser**.
4. Trykk **Last ned**.

## How to test (PR2a1)
1. Åpne `web/index.html` lokalt.
2. Last `web/fixtures/sample.csv`.
3. Kjør anonymisering med maskering:
   - `navn`/`etternavn` blir anonymisert til `[NAME]`.
   - `email`/`telefon`/`fnr` anonymiseres fortsatt.
4. Slå på pseudonymisering og anonymiser igjen:
   - navnkolonner blir `[NAME_1]`, `[NAME_2]`, ...
   - samme inputverdi gir samme token i samme kjøring.
5. Last `web/fixtures/sample_semicolon.csv` og anonymiser: delimiter skal forbli semikolon i output.
6. Last ned CSV og åpne i Excel (eller kompatibelt verktøy) for å bekrefte brukbart format.
7. Klikk **Self-check** og bekreft PASS.

## Known limitations
- Navn i fritekst detekteres **ikke** automatisk.
- Navn anonymiseres kun i CSV-kolonner som matches av støttede header-navn.
- Regex-basert PII-deteksjon kan gi false positives/false negatives.

## Feilsøking (kort)
- Hvis **Anonymiser** er grå: sjekk at filtype er `.txt` eller `.csv`.
- Hvis CSV ser feil ut etter eksport: sjekk input med anførselstegn, komma eller semikolon.
- Skru på **Debug** for konsoll-logger (inkl. matchede name-kolonner).

## Deploy (GitHub Pages)
Workflow: `.github/workflows/pages.yml`.

- Trigger: push til `main`.
- Artifact: `./web` lastes opp og deployes.
- Krav i repo settings:
  1. `Settings` → `Pages`.
  2. Source: **GitHub Actions**.

## Security / Privacy
- Ingen `fetch`, XHR eller WebSocket for databehandling.
- Ingen eksterne CDN-avhengigheter.
- Data behandles kun i browser-minnet.

Se også [`SECURITY.md`](SECURITY.md).
