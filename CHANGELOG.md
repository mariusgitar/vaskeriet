# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- PR3: GitHub Pages workflow (`.github/workflows/pages.yml`) for deploy on push to `main`.
- PR3: `.nojekyll` i `web/` for stabil statisk publisering.
- README deploy-seksjon med oppsett for Pages via GitHub Actions.

### Changed
- README oppdatert til PR3-scope og nye testkriterier for produksjonsdeploy.

### Fixed
- Fjernet placeholder-workflow og erstattet med faktisk deployflyt til Pages.

## [v0.3.0] - after PR3 merge
- Planlagt release-tag etter merge av PR3.

## [v0.2.0]
- PR2: Lokal CSV-parser med støtte for anførselstegn, escaped quotes og komma i felter.
- PR2: CSV-serialisering som bevarer gyldig CSV-format ved eksport.
- PR2: Checkbox for å styre om CSV-header skal anonymiseres.
- Oppdatert `sample.csv` med felter som tester komma og anførselstegn.
- `web/app.js` håndterer CSV som cellerader (ikke rå tekst) ved anonymisering.
- CSV-anonymisering går gjennom alle celler robust, inkludert quoted felter.

## [v0.1.0]
- PR1 skeleton med statisk web-app i `web/`.
- Drag/drop og filvelger for `.txt`/`.csv`.
- Tekst-anonymisering for email, norsk telefon og plausibelt fnr.
- Valgfri pseudonymisering per unik verdi.
- Download av anonymisert output.
- Debug-toggle og self-check i UI.
- Prosjektdokumentasjon (`README`, `SECURITY`, PR-template) og MIT-lisens.
