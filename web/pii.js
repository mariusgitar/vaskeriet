const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_REGEX = /\b(?:\+47\s?)?(?:\d{8}|\d{2}\s\d{2}\s\d{2}\s\d{2})\b/g;
const FNR_REGEX = /\b\d{11}\b/g;

function isPlausibleFnr(value) {
  const dd = Number(value.slice(0, 2));
  const mm = Number(value.slice(2, 4));
  return dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12;
}

function createTokenFactory(enabled, label) {
  if (!enabled) {
    return () => `[${label}]`;
  }

  const seen = new Map();
  return (rawValue) => {
    if (!seen.has(rawValue)) {
      seen.set(rawValue, `[${label}_${seen.size + 1}]`);
    }
    return seen.get(rawValue);
  };
}

export function createAnonymizer(options = {}) {
  const { pseudonymize = false, debug = false } = options;
  const emailToken = createTokenFactory(pseudonymize, 'EMAIL');
  const phoneToken = createTokenFactory(pseudonymize, 'PHONE');
  const fnrToken = createTokenFactory(pseudonymize, 'FNR');
  const nameToken = createTokenFactory(pseudonymize, 'NAME');

  function anonymizeValue(input) {
    let output = input.replace(EMAIL_REGEX, (match) => emailToken(match));
    output = output.replace(PHONE_REGEX, (match) => phoneToken(match));
    output = output.replace(FNR_REGEX, (match) => (isPlausibleFnr(match) ? fnrToken(match) : match));

    if (debug) {
      console.debug('[pii] anonymizeValue completed', {
        inputLength: input.length,
        outputLength: output.length,
        pseudonymize,
      });
    }

    return output;
  }

  return {
    anonymizeValue,
    anonymizeNameCell: (input) => nameToken(input),
  };
}

export function anonymizeText(input, options = {}) {
  return createAnonymizer(options).anonymizeValue(input);
}

export function runSelfChecks() {
  const cases = [
    {
      name: 'mask email/phone/fnr',
      input: 'Kontakt: ola@example.no tlf +47 12 34 56 78 fnr 01019012345',
      options: { pseudonymize: false },
      assert: (value) => value.includes('[EMAIL]') && value.includes('[PHONE]') && value.includes('[FNR]'),
    },
    {
      name: 'pseudonym stable token',
      input: 'a@b.no a@b.no 12345678 12345678',
      options: { pseudonymize: true },
      assert: (value) => (value.match(/\[EMAIL_1\]/g) || []).length === 2 && (value.match(/\[PHONE_1\]/g) || []).length === 2,
    },
    {
      name: 'non-plausible fnr untouched',
      input: '32139912345',
      options: { pseudonymize: false },
      assert: (value) => value === '32139912345',
    },
  ];

  return cases.map((testCase) => {
    const result = anonymizeText(testCase.input, testCase.options);
    const pass = Boolean(testCase.assert(result));
    return { name: testCase.name, pass, result };
  });
}
