# Security Policy

## Privacy-by-design
- Applikasjonen er laget for lokal behandling i browser.
- Ingen persondata skal sendes over nettverk.
- Ingen eksterne scripts/CDN brukes.

## Begrensninger
- Regex-basert PII-deteksjon kan gi false positives/false negatives.
- FNR-validering er bevisst "light" i PR1 (kun dd/mm plausibilitet).

## Rapportering
Oppdaget du et problem? Opprett issue med steg for reproduksjon og forventet/observed oppførsel.
