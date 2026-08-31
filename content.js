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

const dictionary = [
  'the', 'their', 'there', 'that', 'this', 'with', 'from', 'your', 'have',
  'been', 'would', 'about', 'which', 'after', 'other', 'could', 'people',
  'first', 'because', 'through', 'those', 'should', 'where', 'while', 'world',
  'great', 'every', 'under', 'before', 'between', 'another', 'little', 'using',
  'without', 'number', 'however', 'school', 'state', 'right', 'place', 'years',
  'thought', 'still', 'together', 'language', 'example', 'account', 'receive',
  'receiving', 'address', 'calendar', 'separate', 'definitely', 'necessary',
  'successful', 'environment', 'maintenance', 'writing', 'whether', 'whole',
  'initial', 'foreign', 'example', 'different', 'important', 'business', 'answer',
  'question', 'english', 'website', 'chrome', 'browser', 'extension', 'typing',
  'correct', 'correction', 'mistake', 'common', 'spell', 'words', 'real', 'time',
  'suggestion', 'suggestions', 'suggested', 'input', 'field', 'website', 'document'
];

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

function levenshteinDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
}

function getDictionarySuggestions(word, limit = 5) {
  const normalized = word.toLowerCase();
  if (!normalized || normalized.length < 2) {
    return [];
  }

  const results = new Map();

  if (commonCorrections[normalized]) {
    results.set(commonCorrections[normalized], 0);
  }

  for (const item of dictionary) {
    const distance = levenshteinDistance(normalized, item);
    if (distance <= 2 && item !== normalized) {
      const current = results.get(item);
      if (current === undefined || distance < current) {
        results.set(item, distance);
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

function getWordInfoFromInput(element) {
  if (!element || !isTextEditableElement(element)) {
    return null;
  }

  const value = element.value || '';
  const cursorPosition = element.selectionStart ?? value.length;
  let start = cursorPosition;
  let end = cursorPosition;

  while (start > 0 && /[A-Za-z'-]/.test(value[start - 1])) {
    start -= 1;
  }

  while (end < value.length && /[A-Za-z'-]/.test(value[end])) {
    end += 1;
  }

  const word = value.slice(start, end);
  if (!word || word.length < 2) {
    return null;
  }

  if (dictionary.includes(word.toLowerCase())) {
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
      const before = element.value.slice(0, wordInfo.start);
      const after = element.value.slice(wordInfo.end);
      const replacement = applyCase(wordInfo.word, suggestion);
      element.value = `${before}${replacement}${after}`;
      const caretIndex = before.length + replacement.length;
      element.focus();
      element.setSelectionRange(caretIndex, caretIndex);
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
}

function correctElement(element) {
  if (!state.enabled || !isTextEditableElement(element)) {
    return;
  }

  if (element.isContentEditable) {
    const original = element.textContent || '';
    const fixed = original.replace(/\b[A-Za-z][A-Za-z'-]*\b/g, (match) => {
      const lower = match.toLowerCase();
      if (commonCorrections[lower]) {
        return applyCase(match, commonCorrections[lower]);
      }
      return match;
    });

    if (fixed !== original) {
      element.textContent = fixed;
    }
    return;
  }

  const original = element.value || '';
  const fixed = original.replace(/\b[A-Za-z][A-Za-z'-]*\b/g, (match) => {
    const lower = match.toLowerCase();
    if (commonCorrections[lower]) {
      return applyCase(match, commonCorrections[lower]);
    }
    return match;
  });

  if (fixed !== original) {
    element.value = fixed;
  }
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
    if (target && isTextEditableElement(target)) {
      correctElement(target);
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
    const after = before.replace(/\b[A-Za-z][A-Za-z'-]*\b/g, (match) => {
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
