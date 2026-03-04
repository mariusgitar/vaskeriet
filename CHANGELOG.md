# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- PR2a: CSV header-basert anonymisering av navnekolonner (`navn`, `fornavn`, `etternavn`, `name`, `first_name`, `last_name`, `full_name`, m.fl.).
- PR2a: Nye hjelpefunksjoner for header-normalisering og navnkolonne-match (`normalizeHeader`, `isNameHeader`, `getNameColumnIndexes`).
- PR2a: Self-check utvidet med CSV-navnkontroller (ingen rå navn + NAME-tokens + fortsatt EMAIL/PHONE/FNR masking).
- Oppdatert `web/fixtures/sample.csv` med tydelige `navn`/`etternavn` kolonner.
- Lagt til `web/fixtures/sample_semicolon.csv` for semikolon-separert testdekning.

### Changed
- CSV-anonymisering bruker nå `NAME`-token family for navnkolonner basert på header.
- README oppdatert med feature-beskrivelse, known limitations og PR2a teststeg.

### Fixed
- Stable pseudonyms per unique value (consistent mapping) i hele anonymiseringskjøringen for både TXT og CSV.
- CSV delimiter auto-detection (semicolon/comma) fungerer nå for både semikolon- og komma-separert input.

## [v0.3.0]
- GitHub Pages workflow (`.github/workflows/pages.yml`) for deploy on push to `main`.
- `.nojekyll` i `web/` for stabil statisk publisering.
- README deploy-seksjon med oppsett for Pages via GitHub Actions.

## [v0.2.0]
- Lokal CSV-parser med støtte for anførselstegn, escaped quotes og komma i felter.
- CSV-serialisering som bevarer gyldig CSV-format ved eksport.
- Checkbox for å styre om CSV-header skal anonymiseres.
- `web/app.js` håndterer CSV som cellerader (ikke rå tekst) ved anonymisering.
- CSV-anonymisering går gjennom alle celler robust, inkludert quoted felter.

## [v0.1.0]
- Skeleton med statisk web-app i `web/`.
- Drag/drop og filvelger for `.txt`/`.csv`.
- Tekst-anonymisering for email, norsk telefon og plausibelt fnr.
- Valgfri pseudonymisering per unik verdi.
- Download av anonymisert output.
- Debug-toggle og self-check i UI.
- Prosjektdokumentasjon (`README`, `SECURITY`, PR-template) og MIT-lisens.
