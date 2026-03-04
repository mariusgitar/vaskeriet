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

export function parseCsv(input) {
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

    if (ch === ',') {
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
  const needsQuotes = /[",\n\r]/.test(raw);
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function serializeCsv(rows) {
  return rows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(',')).join('\n');
}

export function anonymizeCsvText(input, anonymizeFn, options = {}) {
  const { includeHeader = false, debug = false } = options;
  const rows = parseCsv(input);

  if (rows.length === 0) {
    return '';
  }

  const headerRow = rows[0] || [];
  const nameColumnIndexes = getNameColumnIndexes(headerRow);

  if (debug) {
    const matchedHeaders = nameColumnIndexes.map((index) => headerRow[index]);
    console.debug('[csv] name-column match', { nameColumnIndexes, matchedHeaders });
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

  return serializeCsv(outRows);
}

export function runCsvSelfChecks(anonymizeFnFactory) {
  const sampleCsv = [
    'navn,etternavn,email,telefon,fnr,notat',
    'Ola,Hansen,ola@example.no,12345678,01019012345,"Hei, test"',
    'Kari,Normann,kari@example.no,"12 34 56 78",02029012345,ok',
  ].join('\n');

  const masked = anonymizeCsvText(sampleCsv, anonymizeFnFactory({ pseudonymize: false }), { includeHeader: false });
  const pseudo = anonymizeCsvText(sampleCsv, anonymizeFnFactory({ pseudonymize: true }), { includeHeader: false });

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
  ];
}

export function csvSupportStatus(includeHeader) {
  return includeHeader
    ? 'CSV: anonymiserer alle dataceller, og header hvis valgt. Navnekolonner matches via header.'
    : 'CSV: anonymiserer dataceller. Navnekolonner matches via header.';
}
