# Typing Auto Spell Correcter

A lightweight Chrome extension UI that automatically corrects common typing mistakes as you type in text fields and editable content areas.

## Features

- Auto-corrects common misspellings like `teh` → `the`
- Works in text inputs, textareas, and contenteditable elements
- Includes a popup toggle to enable or disable the feature
- Includes a “Fix This Page” action to correct existing fields on the current page

## Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Turn on “Developer mode”
3. Click “Load unpacked”
4. Select this project folder

## Files

- `manifest.json` – Chrome extension manifest
- `content.js` – spell correction logic and page input handling
- `popup.html` – extension popup UI
- `popup.js` – popup logic to toggle and fix current page
- `popup.css` – popup styling

## Notes

This project is intentionally lightweight and uses a built-in dictionary plus common misspelling replacements.
