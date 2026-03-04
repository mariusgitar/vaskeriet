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
  const { includeHeader = false } = options;
  const rows = parseCsv(input);

  if (rows.length === 0) {
    return '';
  }

  const startRow = includeHeader ? 0 : 1;
  const outRows = rows.map((row, index) => {
    if (index < startRow) {
      return [...row];
    }
    return row.map((cell) => anonymizeFn(cell));
  });

  return serializeCsv(outRows);
}

export function csvSupportStatus(includeHeader) {
  return includeHeader
    ? 'CSV: anonymiserer alle celler inkludert header.'
    : 'CSV: anonymiserer alle dataceller (header beholdes).';
}
