# Typing Auto Spell Correcter

A lightweight Chrome extension UI that automatically corrects common typing mistakes as you type in text fields and editable content areas.

## Features

- Auto-corrects common misspellings like `teh` → `the` as you type, while preserving the cursor position
- Works in text inputs, textareas, and contenteditable elements
- Press Tab to accept the active spelling suggestion; Tab behaves normally when no suggestion is open
- Suggestion buttons wrap long words and resize to fit the viewport
- Includes a popup toggle to enable or disable the feature
- Includes a “Fix This Page” action to correct existing fields on the current page
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
- `popup.js` – popup logic to toggle and fix current page
- `popup.css` – popup styling

## Notes

The extension bundles an offline word list of about 645,000 unique words, including American, British, Canadian, and Australian spelling variants. It uses this list to recognize words and provide suggestions; automatic replacements remain limited to the common typo mappings in `content.js`.
The word list is derived from [SCOWL/GNU Aspell](https://github.com/en-wl/wordlist) through the [dictionary-word-list](https://github.com/nlile/dictionary-word-list) project. See [ENGLISH-WORDS-LICENSE.txt](./ENGLISH-WORDS-LICENSE.txt) for attribution and license terms.

Ad filtering hides recognized page elements; it does not block network requests, and some ads may not be detected.
The popup injects the content script on demand if it is not yet available in the active tab. Chrome restricts extensions from running on some pages, including Chrome settings and the Chrome Web Store.
