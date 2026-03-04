# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- PR2: Lokal CSV-parser med støtte for anførselstegn, escaped quotes og komma i felter.
- PR2: CSV-serialisering som bevarer gyldig CSV-format ved eksport.
- PR2: Checkbox for å styre om CSV-header skal anonymiseres.
- Oppdatert `sample.csv` med felter som tester komma og anførselstegn.

### Changed
- `web/app.js` håndterer nå CSV som cellerader (ikke rå tekst) ved anonymisering.
- README oppdatert med PR2-funksjonalitet, testkriterier og neste plan.

### Fixed
- CSV-anonymisering går nå gjennom alle celler robust, inkludert quoted felter.

## [v0.2.0] - after PR2 merge
- Planlagt release-tag etter merge av PR2.

## [v0.1.0]
- PR1 skeleton med statisk web-app i `web/`.
- Drag/drop og filvelger for `.txt`/`.csv`.
- Tekst-anonymisering for email, norsk telefon og plausibelt fnr.
- Valgfri pseudonymisering per unik verdi.
- Download av anonymisert output.
- Debug-toggle og self-check i UI.
- Prosjektdokumentasjon (`README`, `SECURITY`, PR-template) og MIT-lisens.
