# Typing Auto Spell Correcter

A lightweight Chrome extension UI that automatically corrects common typing mistakes as you type in text fields and editable content areas.

## Features

- Auto-corrects common misspellings like `teh` → `the` as you type, while preserving the cursor position
- Works in text inputs, textareas, and contenteditable elements
- Choose a spelling suggestion by clicking it; Tab keeps its normal browser focus-navigation behavior
- Suggestion buttons wrap long words and resize to fit the viewport
- Automatically enables spelling correction on every supported page
- Automatically corrects known common misspellings in existing editable fields when a page loads
- Hides common ad containers and embeds on webpages

## Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Turn on “Developer mode”
3. Click “Load unpacked”
4. Select this project folder

## Files

- `manifest.json` – Chrome extension manifest
- `ad-blocker.js` – hides common ad containers and ad-network embeds
- `content.js` – spell correction logic and page input handling
- `english-words.txt` – bundled offline English word list
- `ENGLISH-WORDS-LICENSE.txt` – word-list attribution and license terms
- `popup.html` – extension popup UI
- `popup.css` – popup styling

## Notes

The extension bundles an offline word list of about 645,000 unique words, including American, British, Canadian, and Australian spelling variants. It uses this list to recognize words and suggest corrections for misspellings, including adjacent-letter transpositions. Automatic replacements use a curated set of more than 200 common typo mappings in `content.js`; other uncertain matches are shown as suggestions rather than changed automatically.
The word list is derived from [SCOWL/GNU Aspell](https://github.com/en-wl/wordlist) through the [dictionary-word-list](https://github.com/nlile/dictionary-word-list) project. See [ENGLISH-WORDS-LICENSE.txt](./ENGLISH-WORDS-LICENSE.txt) for attribution and license terms.

Ad filtering hides recognized page elements; it does not block network requests, and some ads may not be detected.
Content-script suggestions work in supported webpage fields, not Chrome's address bar or browser UI. Chrome also restricts extensions from running on some pages, including Chrome settings and the Chrome Web Store.
