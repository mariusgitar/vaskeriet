const NAME_HEADERS = new Set([
  'navn',
  'fornavn',
  'etternavn',
  'name',
  'first_name',
  'firstname',
  'last_name',
  'lastname',
  'full_name',
  'fullname',
]);

export function normalizeHeader(value) {
  return String(value ?? '').trim().replace(/^"+|"+$/g, '').trim().toLowerCase();
}

export function isNameHeader(value) {
  return NAME_HEADERS.has(normalizeHeader(value));
}

export function getNameColumnIndexes(headerRow = []) {
  const indexes = [];
  headerRow.forEach((header, index) => {
    if (isNameHeader(header)) {
      indexes.push(index);
    }
  });
  return indexes;
}

function countChar(text, char) {
  return (text.match(new RegExp(`\\${char}`, 'g')) || []).length;
}

export function detectDelimiter(input) {
  const firstNonEmptyLine = String(input ?? '')
    .split(/\r?\n/)
    .find((line) => line.trim().length > 0);

  if (!firstNonEmptyLine) {
    return ',';
  }

  return countChar(firstNonEmptyLine, ';') > countChar(firstNonEmptyLine, ',') ? ';' : ',';
}

export function parseCsv(input, delimiter = ',') {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];

    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === delimiter) {
      row.push(cell);
      cell = '';
      continue;
    }

    if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    if (ch === '\r') {
      continue;
    }

    cell += ch;
  }

  row.push(cell);
  rows.push(row);

  return rows;
}

function escapeCsvCell(value) {
  const raw = String(value ?? '');
  const escaped = raw.replace(/"/g, '""');
  const needsQuotes = /[",;\n\r]/.test(raw);
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function serializeCsv(rows, delimiter = ',') {
  return rows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(delimiter)).join('\n');
}

export function anonymizeCsvText(input, anonymizeFn, options = {}) {
  const { includeHeader = false, debug = false } = options;
  const delimiter = detectDelimiter(input);
  const rows = parseCsv(input, delimiter);

  if (rows.length === 0) {
    return '';
  }

  const headerRow = rows[0] || [];
  const nameColumnIndexes = getNameColumnIndexes(headerRow);

  if (debug) {
    const matchedHeaders = nameColumnIndexes.map((index) => headerRow[index]);
    console.debug('[csv] name-column match', { delimiter, nameColumnIndexes, matchedHeaders });
  }

  const startRow = includeHeader ? 0 : 1;
  const outRows = rows.map((row, rowIndex) => {
    if (rowIndex < startRow) {
      return [...row];
    }

    return row.map((cell, columnIndex) => {
      if (nameColumnIndexes.includes(columnIndex)) {
        return anonymizeFn.anonymizeNameCell(cell);
      }
      return anonymizeFn.anonymizeValue(cell);
    });
  });

  return serializeCsv(outRows, delimiter);
}

export function runCsvSelfChecks(anonymizeFnFactory) {
  const sampleCsv = [
    'navn,etternavn,email,telefon,fnr,notat',
    'Ola,Hansen,ola@example.no,12345678,01019012345,"Hei, test"',
    'Kari,Normann,kari@example.no,"12 34 56 78",02029012345,ok',
  ].join('\n');
  const sampleSemicolonCsv = [
    'navn;telefonnummer;personnummer;epost;hjemmekontor_dager_per_uke',
    'Anders Johansen;41234567;12058512345;anders.johansen@example.com;2',
  ].join('\n');

  const masked = anonymizeCsvText(sampleCsv, anonymizeFnFactory({ pseudonymize: false }), { includeHeader: false });
  const pseudo = anonymizeCsvText(sampleCsv, anonymizeFnFactory({ pseudonymize: true }), { includeHeader: false });
  const semicolonMasked = anonymizeCsvText(sampleSemicolonCsv, anonymizeFnFactory({ pseudonymize: false }), {
    includeHeader: false,
  });

  return [
    {
      name: 'csv name columns masked',
      pass: !masked.includes('Ola') && !masked.includes('Hansen') && masked.includes('[NAME]'),
    },
    {
      name: 'csv name columns pseudonymized',
      pass: pseudo.includes('[NAME_1]') && pseudo.includes('[NAME_2]'),
    },
    {
      name: 'csv still masks email/phone/fnr',
      pass: masked.includes('[EMAIL]') && masked.includes('[PHONE]') && masked.includes('[FNR]'),
    },
    {
      name: 'csv semicolon delimiter preserved and anonymized',
      pass:
        semicolonMasked.includes(';') &&
        semicolonMasked.includes('[NAME]') &&
        semicolonMasked.includes('[PHONE]') &&
        semicolonMasked.includes('[FNR]') &&
        semicolonMasked.includes('[EMAIL]') &&
        !semicolonMasked.includes(','),
    },
  ];
}

export function csvSupportStatus(includeHeader) {
  return includeHeader
    ? 'CSV: anonymiserer alle dataceller, og header hvis valgt. Navnekolonner matches via header. Komma/semikolon støttes automatisk.'
    : 'CSV: anonymiserer dataceller. Navnekolonner matches via header. Komma/semikolon støttes automatisk.';
}
