# PII Scrubber (minimal, statisk)

En liten anonymiseringsapp som kjører **100% lokalt i nettleseren**. Ingen data sendes til server.

## PR2 scope (CSV support + download)
- Ren HTML/CSS/JS uten build-step.
- Drag & drop + filvelger for `.txt` og `.csv`.
- Side-by-side preview (før/etter), avkortet til maks 20k tegn.
- Regler for anonymisering:
  - Email → `[EMAIL]`
  - Norsk telefonnummer → `[PHONE]`
  - Fødselsnummer (11 siffer med enkel plausibilitet dd/mm) → `[FNR]`
- Valgfri pseudonymisering i UI (`[EMAIL_1]`, `[PHONE_1]`, `[FNR_1]`).
- CSV-støtte med lokal parser/serialisering (inkl. anførselstegn og komma i felter).
- CSV-anonymisering av alle celler, med valgfri anonymisering av header via checkbox.
- Last ned anonymisert output (`.txt` og `.csv`).
- Debug-toggle + self-check-knapp.

## Kjøring lokalt
1. Åpne `web/index.html` i nettleser.
2. Last opp `web/fixtures/sample.txt` eller `web/fixtures/sample.csv`.
3. Trykk **Anonymiser**.
4. Trykk **Last ned**.

## Testkriterier (PR2)
- Last `sample.csv` → anonymisering skjer i alle celler (header styres av checkbox).
- Last ned CSV → filen åpner i Excel og inneholder tokens.
- Last `sample.txt` → email/telefon maskeres som før.

## Feilsøking (kort)
- Hvis **Anonymiser** er grå: sjekk at filtype er `.txt` eller `.csv`.
- Hvis CSV ser feil ut etter eksport: sjekk felt med komma/anførselstegn i input.
- Skru på **Debug** for konsoll-logger.
- Klikk **Self-check** for enkel PASS/FAIL av kjerneregler.

## Security / Privacy
- Ingen `fetch`, XHR eller WebSocket for databehandling.
- Ingen eksterne CDN-avhengigheter.
- Data behandles kun i browser-minnet.

Se også [`SECURITY.md`](SECURITY.md).

## Next PR plan
- Legge til GitHub Pages deploy-workflow på push til `main`.
- Sikre Pages-hosting uten Jekyll ved behov (`.nojekyll`).
- Mindre UX-polering og deploy-dokumentasjon.
