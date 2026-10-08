(() => {
  const initializedKey = '__spellCorrecterContentScriptInitialized';
  if (globalThis[initializedKey]) {
    return;
  }
  globalThis[initializedKey] = true;

const commonCorrections = {
  abscence: 'absence',
  abudance: 'abundance',
  accomodate: 'accommodate',
  accomodation: 'accommodation',
  acheive: 'achieve',
  achievment: 'achievement',
  acknowlege: 'acknowledge',
  acommodate: 'accommodate',
  aparent: 'apparent',
  apparant: 'apparent',
  appearence: 'appearance',
  appologize: 'apologize',
  arguement: 'argument',
  arangement: 'arrangement',
  begining: 'beginning',
  beleive: 'believe',
  calander: 'calendar',
  calender: 'calendar',
  catagory: 'category',
  collegue: 'colleague',
  comittee: 'committee',
  comming: 'coming',
  concensus: 'consensus',
  definately: 'definitely',
  definate: 'definite',
  dissapear: 'disappear',
  dissapoint: 'disappoint',
  embarass: 'embarrass',
  enviroment: 'environment',
  existance: 'existence',
  experiance: 'experience',
  familar: 'familiar',
  finaly: 'finally',
  foriegn: 'foreign',
  fourty: 'forty',
  freind: 'friend',
  goverment: 'government',
  grammer: 'grammar',
  happend: 'happened',
  independant: 'independent',
  knowlege: 'knowledge',
  liason: 'liaison',
  librarry: 'library',
  maintenence: 'maintenance',
  millenium: 'millennium',
  neccessary: 'necessary',
  occassion: 'occasion',
  occured: 'occurred',
  ocurred: 'occurred',
  perserverance: 'perseverance',
  posession: 'possession',
  potencial: 'potential',
  prefered: 'preferred',
  priviledge: 'privilege',
  recieved: 'received',
  recieve: 'receive',
  recieving: 'receiving',
  recomend: 'recommend',
  refered: 'referred',
  relevent: 'relevant',
  seperate: 'separate',
  seperat: 'separate',
  seprate: 'separate',
  succesful: 'successful',
  suprise: 'surprise',
  teh: 'the',
  thier: 'their',
  tommorow: 'tomorrow',
  truely: 'truly',
  untill: 'until',
  wierd: 'weird',
  wich: 'which',
  adress: 'address',
  adresss: 'address',
  aggresive: 'aggressive',
  agressive: 'aggressive',
  aquaintance: 'acquaintance',
  basicly: 'basically',
  bussiness: 'business',
  buisness: 'business',
  cemetry: 'cemetery',
  changeing: 'changing',
  comitted: 'committed',
  comparision: 'comparison',
  completly: 'completely',
  consistant: 'consistent',
  convinient: 'convenient',
  critisize: 'criticize',
  curiousity: 'curiosity',
  decison: 'decision',
  descision: 'decision',
  desparate: 'desperate',
  developement: 'development',
  diffrent: 'different',
  dimention: 'dimension',
  diptheria: 'diphtheria',
  disagrement: 'disagreement',
  disapoint: 'disappoint',
  ecstacy: 'ecstasy',
  eightteen: 'eighteen',
  equiptment: 'equipment',
  excellant: 'excellent',
  excercise: 'exercise',
  facist: 'fascist',
  familliar: 'familiar',
  feeled: 'felt',
  firey: 'fiery',
  flourescent: 'fluorescent',
  forsee: 'foresee',
  gaurd: 'guard',
  genuin: 'genuine',
  greatful: 'grateful',
  guage: 'gauge',
  harrass: 'harass',
  imediately: 'immediately',
  imediatly: 'immediately',
  immitate: 'imitate',
  incidently: 'incidentally',
  indefinately: 'indefinitely',
  indispensible: 'indispensable',
  inteligence: 'intelligence',
  intresting: 'interesting',
  jewellry: 'jewelry',
  kernal: 'kernel',
  liesure: 'leisure',
  lisence: 'license',
  lonley: 'lonely',
  manuever: 'maneuver',
  mischievious: 'mischievous',
  mispell: 'misspell',
  neice: 'niece',
  noticable: 'noticeable',
  ocasion: 'occasion',
  occurrance: 'occurrence',
  omision: 'omission',
  oportunity: 'opportunity',
  parliment: 'parliament',
  persistance: 'persistence',
  persue: 'pursue',
  pratice: 'practice',
  propoganda: 'propaganda',
  publically: 'publicly',
  realy: 'really',
  recomendation: 'recommendation',
  restaraunt: 'restaurant',
  rythym: 'rhythm',
  santion: 'sanction',
  sheat: 'sheet',
  similiar: 'similar',
  sincerly: 'sincerely',
  spearayte: 'separate',
  supercede: 'supersede',
  tendancy: 'tendency',
  therefor: 'therefore',
  tounge: 'tongue',
  transfered: 'transferred',
  unfortunatly: 'unfortunately',
  usefull: 'useful',
  villian: 'villain',
  weild: 'wield',
  writting: 'writing',
  xmas: 'Christmas',
  acount: 'account',
  accross: 'across',
  agian: 'again',
  allmost: 'almost',
  allready: 'already',
  anounce: 'announce',
  anser: 'answer',
  apparantly: 'apparently',
  becuase: 'because',
  beginining: 'beginning',
  beleif: 'belief',
  benifit: 'benefit',
  bizzare: 'bizarre',
  brocolli: 'broccoli',
  caffiene: 'caffeine',
  cemetary: 'cemetery',
  cheif: 'chief',
  cliant: 'client',
  diffrence: 'difference',
  disapointed: 'disappointed',
  enviornment: 'environment',
  eventhough: 'even though',
  everyting: 'everything',
  foward: 'forward',
  freindly: 'friendly',
  governer: 'governor',
  hieght: 'height',
  importent: 'important',
  interupt: 'interrupt',
  langauge: 'language',
  lenght: 'length',
  mispelled: 'misspelled',
  necesary: 'necessary',
  offical: 'official',
  ommit: 'omit',
  oppertunity: 'opportunity',
  possable: 'possible',
  probaly: 'probably',
  recieveing: 'receiving',
  remeber: 'remember',
  responsibile: 'responsible',
  seperateley: 'separately',
  succesfully: 'successfully',
  tahn: 'than',
  tommorrow: 'tomorrow',
  untimatly: 'ultimately',
  wierdly: 'weirdly',
  woudl: 'would',
  alot: 'a lot',
  amoung: 'among',
  exmaple: 'example',
  goign: 'going',
  happne: 'happen',
  indespensible: 'indispensable',
  intial: 'initial',
  lanauge: 'language',
  maintainance: 'maintenance',
  mathces: 'matches',
  paramenter: 'parameter',
  paramters: 'parameters',
  wether: 'whether',
  whetever: 'whenever',
  whoel: 'whole',
  deatachmens: 'detachments'
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

  const activeElement = document.activeElement;
  if (activeElement && isTextEditableElement(activeElement)) {
    handleTypingSuggestions({ target: activeElement });
  }
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
      display: none;
      gap: 6px;
      flex-wrap: wrap;
      align-items: flex-start;
      background: rgba(17, 24, 39, 0.97);
      color: white;
      border: 1px solid rgba(148, 163, 184, 0.7);
      border-radius: 10px;
      padding: 8px 10px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.25);
      width: max-content;
      max-width: min(420px, calc(100vw - 20px));
      max-height: 40vh;
      overflow-y: auto;
      box-sizing: border-box;
      pointer-events: auto;
    }

    .spell-correcter-suggestion {
      min-width: 0;
      max-width: 100%;
      background: #2563eb;
      border: none;
      border-radius: 999px;
      padding: 5px 10px;
      color: white;
      font-size: 12px;
      cursor: pointer;
      line-height: 1.2;
      white-space: normal;
      overflow-wrap: anywhere;
      text-align: left;
      transition: background 0.15s ease;
    }

    .spell-correcter-suggestion:hover,
    .spell-correcter-suggestion.active {
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
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        current[j] = Math.min(current[j], rows[2][j - 2] + 1);
      }
      rowMinimum = Math.min(rowMinimum, current[j]);
    }

    if (rowMinimum > 2) {
      return 3;
    }

    rows[2].set(previous);
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

  if (!commonCorrections[word.toLowerCase()] && dictionaryContains(word.toLowerCase())) {
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

function applySuggestion(element, wordInfo, suggestion) {
  const replacement = applyCase(wordInfo.word, suggestion);
  if (element.isContentEditable) {
    const cursorPosition = getCaretPositionInContentEditable(element);
    replaceContentEditableText(
      element,
      wordInfo.start,
      wordInfo.end,
      replacement,
      cursorPosition
    );
  } else {
    const caretPosition = wordInfo.start + replacement.length;
    replaceInputText(element, wordInfo.start, wordInfo.end, replacement);
    element.focus();
    element.setSelectionRange(caretPosition, caretPosition);
  }

  hideSuggestions();
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
    box.setAttribute('role', 'listbox');
    document.body.appendChild(box);
  }

  box.innerHTML = '';
  suggestions.forEach((suggestion) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'spell-correcter-suggestion';
    button.textContent = applyCase(wordInfo.word, suggestion);
    button.setAttribute('role', 'option');
    button.tabIndex = -1;
    button.addEventListener('click', () => {
      applySuggestion(element, wordInfo, suggestion);
    });
    box.appendChild(button);
  });

  const rect = element.getBoundingClientRect();
  box.style.display = 'flex';
  const boxRect = box.getBoundingClientRect();
  const left = Math.max(10, Math.min(rect.left, window.innerWidth - boxRect.width - 10));
  const above = rect.top - boxRect.height - 8;
  const top = above >= 8
    ? above
    : Math.min(window.innerHeight - boxRect.height - 8, rect.bottom + 8);

  box.style.left = `${left}px`;
  box.style.top = `${Math.max(8, top)}px`;
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
  if (cursorPosition > 0 && /[\p{L}\p{M}'-]/u.test(value[cursorPosition - 1])) {
    return false;
  }

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

function fixAllEditableFields(root = document) {
  const editableSelector =
    'textarea, input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), [contenteditable="true"], [contenteditable=""], [contenteditable="plaintext-only"]';
  const editableElements = new Set();
  if (root instanceof Element && root.matches(editableSelector)) {
    editableElements.add(root);
  }
  root.querySelectorAll(editableSelector).forEach((element) => {
    editableElements.add(element);
  });

  let count = 0;
  editableElements.forEach((element) => {
    if (!isTextEditableElement(element)) {
      return;
    }

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

function observeEditableFields() {
  const observer = new MutationObserver((records) => {
    const roots = new Set();
    records.forEach((record) => {
      if (record.type === 'attributes') {
        roots.add(record.target);
        return;
      }

      record.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          roots.add(node);
        }
      });

      const editableAncestor = record.target.parentElement?.closest(
        '[contenteditable="true"], [contenteditable=""], [contenteditable="plaintext-only"]'
      );
      if (editableAncestor) {
        roots.add(editableAncestor);
      }
    });
    roots.forEach((root) => fixAllEditableFields(root));
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['contenteditable', 'type']
  });
}

injectSuggestionStyles();
hideSuggestions();
observeTextInputs();
fixAllEditableFields();
observeEditableFields();
})();
