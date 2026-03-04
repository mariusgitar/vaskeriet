# PII Scrubber (minimal, statisk)

En liten anonymiseringsapp som kjører **100% lokalt i nettleseren**. Ingen data sendes til server.

## PR1 scope (skeleton + basic text scrub)
- Ren HTML/CSS/JS uten build-step.
- Drag & drop + filvelger for `.txt` og `.csv`.
- Side-by-side preview (før/etter), avkortet til maks 20k tegn.
- Regler for anonymisering i tekst:
  - Email → `[EMAIL]`
  - Norsk telefonnummer → `[PHONE]`
  - Fødselsnummer (11 siffer med enkel plausibilitet dd/mm) → `[FNR]`
- Valgfri pseudonymisering i UI:
  - `[EMAIL_1]`, `[PHONE_1]`, `[FNR_1]` per unik verdi.
- Last ned anonymisert fil.
- Debug-toggle + self-check-knapp.

> CSV cellenivå-parser med robust quote/komma-håndtering leveres i PR2.

## Kjøring lokalt
1. Åpne `web/index.html` i nettleser.
2. Last opp `web/fixtures/sample.txt`.
3. Trykk **Anonymiser**.
4. Trykk **Last ned**.

## Testkriterier (PR1)
- Åpne `web/index.html` lokalt → last `sample.txt` → preview viser endring → last ned fungerer.
- Email og telefon blir maskert i txt.

## Feilsøking (kort)
- Hvis **Anonymiser** er grå: sjekk at filtype er `.txt` eller `.csv`.
- Hvis preview ser tom ut: test med mindre fil først.
- Skru på **Debug** for konsoll-logger.
- Klikk **Self-check** for enkel PASS/FAIL av kjerneregler.

## Security / Privacy
- Ingen `fetch`, XHR eller WebSocket for databehandling.
- Ingen eksterne CDN-avhengigheter.
- Data behandles kun i browser-minnet.

Se også [`SECURITY.md`](SECURITY.md).

## Next PR plan
- Implementere robust CSV parse/serialize (inkl. anførselstegn/komma).
- Anonymisere alle CSV-celler, med valgfri anonymisering av header.
- Bedre CSV-spesifikke tester og eksportvalidering (Excel-kompatibilitet).
