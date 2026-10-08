(() => {
  const initializedKey = '__spellCorrecterContentScriptInitialized';
  if (globalThis[initializedKey]) {
    return;
  }
  globalThis[initializedKey] = true;

const commonCorrections = {
  teh: 'the',
  thier: 'their',
  recieve: 'receive',
  recieving: 'receiving',
  seperat: 'separate',
  seprate: 'separate',
  acount: 'account',
  adress: 'address',
  alot: 'a lot',
  amoung: 'among',
  begining: 'beginning',
  calender: 'calendar',
  comming: 'coming',
  definately: 'definitely',
  desparate: 'desperate',
  enviroment: 'environment',
  exmaple: 'example',
  foriegn: 'foreign',
  goign: 'going',
  happend: 'happened',
  happne: 'happen',
  indespensible: 'indispensable',
  intial: 'initial',
  lanauge: 'language',
  maintainance: 'maintenance',
  mathces: 'matches',
  mispell: 'misspell',
  neccessary: 'necessary',
  occured: 'occurred',
  paramenter: 'parameter',
  paramters: 'parameters',
  persistance: 'persistence',
  refered: 'referred',
  seperate: 'separate',
  succesful: 'successful',
  untill: 'until',
  usefull: 'useful',
  wether: 'whether',
  whetever: 'whenever',
  wierd: 'weird',
  writting: 'writing',
  whoel: 'whole',
  xmas: 'Christmas'
};

let dictionaryText = '';
let dictionaryOffsets = new Uint32Array(0);
const dictionaryBuckets = new Map();
let dictionaryReady = false;

function initializeDictionary(text) {
  const separator = '\n---\n';
  const separatorIndex = text.indexOf(separator);
  if (separatorIndex === -1) {
    throw new Error('Dictionary data separator is missing.');
  }

  text = text.slice(separatorIndex + separator.length);
  dictionaryText = text;
  let lineStart = 0;
  let totalWords = 0;

  while (lineStart < text.length) {
    const lineEnd = text.indexOf('\n', lineStart);
    const end = lineEnd === -1 ? text.length : lineEnd;
    const bucketKey = `${end - lineStart}:${text[lineStart]}`;
    const bucket = dictionaryBuckets.get(bucketKey);

    if (bucket) {
      bucket.count += 1;
    } else {
      dictionaryBuckets.set(bucketKey, { count: 1 });
    }
    totalWords += 1;
    lineStart = end + 1;
  }

  let bucketStart = 0;
  for (const bucket of dictionaryBuckets.values()) {
    bucket.start = bucketStart;
    bucket.cursor = bucketStart;
    bucketStart += bucket.count;
    bucket.end = bucketStart;
  }

  dictionaryOffsets = new Uint32Array(totalWords);
  lineStart = 0;
  while (lineStart < text.length) {
    const lineEnd = text.indexOf('\n', lineStart);
    const end = lineEnd === -1 ? text.length : lineEnd;
    const bucket = dictionaryBuckets.get(`${end - lineStart}:${text[lineStart]}`);
    dictionaryOffsets[bucket.cursor] = lineStart;
    bucket.cursor += 1;
    lineStart = end + 1;
  }

  dictionaryReady = true;
}

fetch(chrome.runtime.getURL('english-words.txt'))
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Dictionary request failed with status ${response.status}.`);
    }
    return response.text();
  })
  .then(initializeDictionary)
  .catch((error) => {
    console.error('Spell Correcter could not load its offline dictionary.', error);
  });

const state = {
  enabled: true
};

const suggestionBoxId = 'spell-correcter-suggestions';

chrome.storage.local.get(['spellCorrecterEnabled'], (result) => {
  state.enabled = result.spellCorrecterEnabled !== false;
});

function injectSuggestionStyles() {
  if (document.getElementById('spell-correcter-suggestions-style')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'spell-correcter-suggestions-style';
  style.textContent = `
    .spell-correcter-suggestions {
      position: fixed;
      z-index: 2147483647;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      background: rgba(17, 24, 39, 0.97);
      color: white;
      border: 1px solid rgba(148, 163, 184, 0.7);
      border-radius: 10px;
      padding: 8px 10px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.25);
      max-width: 320px;
      pointer-events: auto;
    }

    .spell-correcter-suggestion {
      background: #2563eb;
      border: none;
      border-radius: 999px;
      padding: 5px 10px;
      color: white;
      font-size: 12px;
      cursor: pointer;
      line-height: 1.2;
      transition: background 0.15s ease;
    }

    .spell-correcter-suggestion:hover {
      background: #1d4ed8;
    }
  `;
  document.head.appendChild(style);
}

function applyCase(original, corrected) {
  if (original === original.toUpperCase()) {
    return corrected.toUpperCase();
  }

  if (original.charAt(0) === original.charAt(0).toUpperCase()) {
    return corrected.charAt(0).toUpperCase() + corrected.slice(1);
  }

  return corrected;
}

function levenshteinDistance(a, b, rows) {
  if (Math.abs(a.length - b.length) > 2) {
    return 3;
  }

  let previous = rows[0];
  let current = rows[1];
  previous.fill(3);
  for (let j = 0; j <= Math.min(b.length, 2); j += 1) {
    previous[j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    current.fill(3);
    current[0] = i;
    let rowMinimum = 3;

    for (let j = Math.max(1, i - 2); j <= Math.min(b.length, i + 2); j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost
      );
      rowMinimum = Math.min(rowMinimum, current[j]);
    }

    if (rowMinimum > 2) {
      return 3;
    }

    [previous, current] = [current, previous];
  }

  return previous[b.length] <= 2 ? previous[b.length] : 3;
}

function dictionaryContains(word) {
  let low = 0;
  let high = dictionaryText.length - 1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const start = dictionaryText.lastIndexOf('\n', middle - 1) + 1;
    const newline = dictionaryText.indexOf('\n', middle);
    const end = newline === -1 ? dictionaryText.length : newline;
    const candidate = dictionaryText.slice(start, end);

    if (candidate === word) {
      return true;
    }
    if (candidate < word) {
      low = end + 1;
    } else {
      high = start - 1;
    }
  }

  return false;
}

function getDictionarySuggestions(word, limit = 5) {
  const normalized = word.toLowerCase();
  if (!dictionaryReady || !normalized || normalized.length < 2 || normalized.length > 32) {
    return [];
  }

  const results = new Map();

  if (commonCorrections[normalized]) {
    results.set(commonCorrections[normalized], 0);
  }

  const rows = [
    new Uint8Array(normalized.length + 3),
    new Uint8Array(normalized.length + 3)
  ];
  const minimumLength = Math.max(1, normalized.length - 2);
  const maximumLength = normalized.length + 2;

  for (let candidateLength = minimumLength; candidateLength <= maximumLength; candidateLength += 1) {
    const bucket = dictionaryBuckets.get(`${candidateLength}:${normalized[0]}`);
    if (!bucket) {
      continue;
    }

    for (let index = bucket.start; index < bucket.end; index += 1) {
      const lineStart = dictionaryOffsets[index];
      const lineEnd = dictionaryText.indexOf('\n', lineStart);
      const candidate = dictionaryText.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
      if (candidate === normalized) {
        continue;
      }

      const distance = levenshteinDistance(normalized, candidate, rows);
      if (distance <= 2) {
        const current = results.get(candidate);
        if (current === undefined || distance < current) {
          results.set(candidate, distance);
        }
      }
    }
  }

  return [...results.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, limit)
    .map(([suggestion]) => suggestion);
}

function isTextEditableElement(element) {
  if (!element || !(element instanceof HTMLElement)) {
    return false;
  }

  if (element.isContentEditable) {
    return true;
  }

  if (element.tagName === 'TEXTAREA') {
    return true;
  }

  if (element.tagName === 'INPUT') {
    const type = element.type || 'text';
    return ['text', 'search', 'email', 'url', 'tel', 'password'].includes(type.toLowerCase());
  }

  return false;
}

function getCaretPositionInContentEditable(element) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return (element.textContent || '').length;
  }

  const range = selection.getRangeAt(0).cloneRange();
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(element);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  return preCaretRange.toString().length;
}

function setCaretPositionInContentEditable(element, offset) {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const textNode = element.firstChild || document.createTextNode('');
  if (!element.firstChild) {
    element.appendChild(textNode);
  }

  const range = document.createRange();
  range.setStart(textNode, Math.min(offset, textNode.textContent.length));
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function getWordInfoFromInput(element) {
  if (!dictionaryReady || !element || !isTextEditableElement(element)) {
    return null;
  }

  const value = element.value ?? element.textContent ?? '';
  const cursorPosition = element.isContentEditable
    ? getCaretPositionInContentEditable(element)
    : (element.selectionStart ?? value.length);

  let start = cursorPosition;
  let end = cursorPosition;

  while (start > 0 && /[\p{L}\p{M}'-]/u.test(value[start - 1])) {
    start -= 1;
  }

  while (end < value.length && /[\p{L}\p{M}'-]/u.test(value[end])) {
    end += 1;
  }

  const word = value.slice(start, end);
  if (!word || word.length < 2) {
    return null;
  }

  if (dictionaryContains(word.toLowerCase())) {
    return null;
  }

  return { word, start, end };
}

function hideSuggestions() {
  const existing = document.getElementById(suggestionBoxId);
  if (existing) {
    existing.remove();
  }
}

function renderSuggestions(element, wordInfo) {
  const suggestions = getDictionarySuggestions(wordInfo.word, 5);
  if (!suggestions.length) {
    hideSuggestions();
    return;
  }

  let box = document.getElementById(suggestionBoxId);
  if (!box) {
    box = document.createElement('div');
    box.id = suggestionBoxId;
    box.className = 'spell-correcter-suggestions';
    document.body.appendChild(box);
  }

  box.innerHTML = '';
  suggestions.forEach((suggestion) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'spell-correcter-suggestion';
    button.textContent = applyCase(wordInfo.word, suggestion);
    button.addEventListener('click', () => {
      const currentText = element.value ?? element.textContent ?? '';
      const before = currentText.slice(0, wordInfo.start);
      const after = currentText.slice(wordInfo.end);
      const replacement = applyCase(wordInfo.word, suggestion);
      const updatedText = `${before}${replacement}${after}`;

      if (element.isContentEditable) {
        element.textContent = updatedText;
        const caretIndex = before.length + replacement.length;
        setCaretPositionInContentEditable(element, caretIndex);
      } else {
        element.value = updatedText;
        const caretIndex = before.length + replacement.length;
        element.focus();
        element.setSelectionRange(caretIndex, caretIndex);
      }

      hideSuggestions();
    });
    box.appendChild(button);
  });

  const rect = element.getBoundingClientRect();
  const boxWidth = Math.min(320, suggestions.length * 80 + 20);
  const top = Math.max(8, rect.top - 45);
  const left = Math.min(window.innerWidth - boxWidth - 10, rect.left);

  box.style.left = `${Math.max(10, left)}px`;
  box.style.top = `${Math.max(10, top)}px`;
  box.style.width = `${boxWidth}px`;
  box.style.display = 'flex';
}

const correctingElements = new WeakSet();

function replaceInputText(element, start, end, replacement) {
  const originalCaretPosition = element.selectionStart;
  const updatedValue = `${element.value.slice(0, start)}${replacement}${element.value.slice(end)}`;
  const valueDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
  if (valueDescriptor?.set) {
    valueDescriptor.set.call(element, updatedValue);
  } else {
    element.value = updatedValue;
  }

  const caretPosition = originalCaretPosition + replacement.length - (end - start);
  element.setSelectionRange(caretPosition, caretPosition);
  correctingElements.add(element);
  element.dispatchEvent(new InputEvent('input', {
    bubbles: true,
    inputType: 'insertReplacementText',
    data: replacement
  }));
  correctingElements.delete(element);
}

function getTextNodeAtOffset(element, offset) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let node = walker.nextNode();

  while (node) {
    if (remaining <= node.textContent.length) {
      return { node, offset: remaining };
    }
    remaining -= node.textContent.length;
    node = walker.nextNode();
  }

  return null;
}

function replaceContentEditableText(element, start, end, replacement, originalCaretPosition) {
  const startPoint = getTextNodeAtOffset(element, start);
  const endPoint = getTextNodeAtOffset(element, end);
  if (!startPoint || !endPoint) {
    return false;
  }

  const range = document.createRange();
  range.setStart(startPoint.node, startPoint.offset);
  range.setEnd(endPoint.node, endPoint.offset);
  range.deleteContents();

  const replacementNode = document.createTextNode(replacement);
  range.insertNode(replacementNode);
  const caretPoint = getTextNodeAtOffset(
    element,
    originalCaretPosition + replacement.length - (end - start)
  );
  if (!caretPoint) {
    return false;
  }
  range.setStart(caretPoint.node, caretPoint.offset);
  range.collapse(true);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  correctingElements.add(element);
  element.dispatchEvent(new InputEvent('input', {
    bubbles: true,
    inputType: 'insertReplacementText',
    data: replacement
  }));
  correctingElements.delete(element);
  return true;
}

function correctCompletedWord(element) {
  if (!state.enabled || !isTextEditableElement(element)) {
    return false;
  }

  const value = element.value ?? element.textContent ?? '';
  const cursorPosition = element.isContentEditable
    ? getCaretPositionInContentEditable(element)
    : (element.selectionStart ?? value.length);
  let end = cursorPosition;

  if (end > 0 && !/[\p{L}\p{M}'-]/u.test(value[end - 1])) {
    end -= 1;
  }

  let start = end;
  while (start > 0 && /[\p{L}\p{M}'-]/u.test(value[start - 1])) {
    start -= 1;
  }

  const word = value.slice(start, end);
  const correction = commonCorrections[word.toLowerCase()];
  if (!correction) {
    return false;
  }

  const replacement = applyCase(word, correction);
  if (element.isContentEditable) {
    return replaceContentEditableText(element, start, end, replacement, cursorPosition);
  }

  replaceInputText(element, start, end, replacement);
  return true;
}

function handleTypingSuggestions(event) {
  if (!state.enabled) {
    hideSuggestions();
    return;
  }

  const target = event.target;
  if (!target || !isTextEditableElement(target)) {
    hideSuggestions();
    return;
  }

  const wordInfo = getWordInfoFromInput(target);
  if (!wordInfo) {
    hideSuggestions();
    return;
  }

  renderSuggestions(target, wordInfo);
}

function observeTextInputs() {
  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target && isTextEditableElement(target) && !correctingElements.has(target)) {
      correctCompletedWord(target);
      handleTypingSuggestions(event);
    }
  }, true);

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || !isTextEditableElement(target)) {
      hideSuggestions();
    }
  }, true);

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      hideSuggestions();
    }
  });

  document.addEventListener('focusin', (event) => {
    const target = event.target;
    if (target && isTextEditableElement(target)) {
      handleTypingSuggestions({ target });
    }
  });
}

function fixAllEditableFields() {
  const editableElements = document.querySelectorAll(
    'textarea, input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), [contenteditable="true"], [contenteditable=""], [contenteditable="plaintext-only"]'
  );

  let count = 0;
  editableElements.forEach((element) => {
    const before = element.value ?? element.textContent ?? '';
    const after = before.replace(/[\p{L}][\p{L}'-]*/gu, (match) => {
      const lower = match.toLowerCase();
      if (commonCorrections[lower]) {
        return applyCase(match, commonCorrections[lower]);
      }
      return match;
    });

    if (after !== before) {
      if (element.isContentEditable) {
        element.textContent = after;
      } else {
        element.value = after;
      }
      count += 1;
    }
  });

  return count;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggle') {
    state.enabled = !!message.enabled;
    chrome.storage.local.set({ spellCorrecterEnabled: state.enabled });
    if (!state.enabled) {
      hideSuggestions();
    }
    sendResponse({ enabled: state.enabled });
    return true;
  }

  if (message.action === 'status') {
    sendResponse({ enabled: state.enabled });
    return true;
  }

  if (message.action === 'fixCurrentPage') {
    const fixedCount = fixAllEditableFields();
    sendResponse({ fixedCount });
    return true;
  }

  return false;
});

injectSuggestionStyles();
hideSuggestions();
observeTextInputs();
})();
