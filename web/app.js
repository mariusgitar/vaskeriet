import { anonymizeText, runSelfChecks } from './pii.js';
import { csvSupportStatus } from './csv.js';

const MAX_PREVIEW = 20_000;

const state = {
  debug: false,
  sourceName: '',
  sourceText: '',
  outputText: '',
};

const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const statusEl = document.getElementById('status');
const fileMetaEl = document.getElementById('file-meta');
const beforePreviewEl = document.getElementById('before-preview');
const afterPreviewEl = document.getElementById('after-preview');
const anonymizeBtn = document.getElementById('anonymize-btn');
const downloadBtn = document.getElementById('download-btn');
const pseudoToggle = document.getElementById('mode-pseudo');
const debugToggle = document.getElementById('debug-toggle');
const selfCheckBtn = document.getElementById('self-check-btn');

function logDebug(...args) {
  if (state.debug) {
    console.debug('[app]', ...args);
  }
}

function setStatus(message) {
  statusEl.textContent = message;
  logDebug('status', message);
}

function asPreview(text) {
  return text.length > MAX_PREVIEW ? `${text.slice(0, MAX_PREVIEW)}\n\n[Preview truncated at ${MAX_PREVIEW} chars]` : text;
}

function updatePreview() {
  beforePreviewEl.textContent = asPreview(state.sourceText);
  afterPreviewEl.textContent = asPreview(state.outputText);
}

async function readFile(file) {
  state.sourceName = file.name;
  state.sourceText = await file.text();
  state.outputText = '';

  fileMetaEl.textContent = `${file.name} (${file.type || 'unknown type'}, ${file.size} bytes)`;
  setStatus(file.name.toLowerCase().endsWith('.csv') ? csvSupportStatus() : 'Fil lastet. Klar for anonymisering.');

  anonymizeBtn.disabled = false;
  downloadBtn.disabled = true;
  updatePreview();
}

function handleFiles(fileList) {
  const [file] = fileList;
  if (!file) {
    return;
  }

  const supported = /\.(txt|csv)$/i.test(file.name);
  if (!supported) {
    setStatus('Ugyldig filtype. Bruk .txt eller .csv.');
    return;
  }

  readFile(file).catch((error) => {
    console.error(error);
    setStatus('Kunne ikke lese fil.');
  });
}

fileInput.addEventListener('change', (event) => {
  handleFiles(event.target.files);
});

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragover');
  handleFiles(event.dataTransfer.files);
});

anonymizeBtn.addEventListener('click', () => {
  state.outputText = anonymizeText(state.sourceText, {
    pseudonymize: pseudoToggle.checked,
    debug: state.debug,
  });

  updatePreview();
  downloadBtn.disabled = false;
  setStatus('Anonymisering fullført.');
});

downloadBtn.addEventListener('click', () => {
  const ext = state.sourceName.toLowerCase().endsWith('.csv') ? 'csv' : 'txt';
  const blob = new Blob([state.outputText], { type: 'text/plain;charset=utf-8' });
  const outName = `${state.sourceName.replace(/\.[^.]+$/, '') || 'anonymized'}.anonymized.${ext}`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = outName;
  link.click();
  URL.revokeObjectURL(url);

  setStatus(`Lastet ned: ${outName}`);
});

debugToggle.addEventListener('change', () => {
  state.debug = debugToggle.checked;
  setStatus(state.debug ? 'Debug logging er på.' : 'Debug logging er av.');
});

selfCheckBtn.addEventListener('click', () => {
  const results = runSelfChecks();
  const pass = results.every((item) => item.pass);
  const summary = results.map((item) => `${item.pass ? 'PASS' : 'FAIL'}: ${item.name}`).join(' | ');
  setStatus(`Self-check ${pass ? 'PASS' : 'FAIL'} → ${summary}`);
  logDebug('self-check results', results);
});

setStatus('Last opp en .txt eller .csv for å starte.');
