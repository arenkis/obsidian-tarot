# Tarot Card Draw

An Obsidian plugin that lets you draw Tarot cards—either on demand or automatically in your daily note—and appends card names with upright/reversed meanings.

---

## Features

* **On-demand draw**
  Use the “Draw Tarot Cards” command to pick from three spread options:

  * Single Card
  * Three Card Spread
  * Celtic Cross

* **Auto-append**
  When you create a new daily note, the plugin automatically performs a **Three Card Spread** and appends the reading.

* **Rich formatting**
  Injects readings as blockquotes with card orientation (Upright/Reversed) and corresponding meanings.

---

## Requirements

* **Obsidian** v0.12.0 or later
* **Daily Notes** core plugin enabled (for the auto-append feature)

---

## Installation

1. Clone or download into your vault’s plugin folder: <your-vault>/.obsidian/plugins/tarot/
2. Open Obsidian → **Settings → Community plugins** → **Disabled plugins**, find **Tarot Card Draw**, and click **Enable**.
3. (Optional) Ensure **Daily Notes** is enabled under **Settings → Core plugins**.

---

## Usage

### 1. Draw on Demand

1. Press Ctrl+P (or Cmd+P).
2. Run **Draw Tarot Cards**.
3. In the prompt modal, choose your spread.
4. The plugin draws, formats, and appends the reading to today’s daily note:

> \[!INFO] Tarot: Three Card Spread
>
> 1. **The Fool** (Upright): innocence, new beginnings, free spirit
> 2. **Queen of Cups** (Reversed): martyrdom, insecurity, dependence
> 3. **Ten of Wands** (Upright): accomplishment, responsibility, burden
>
> ---

### 2. Auto-Append in New Notes

Every time you create a new daily note, the plugin automatically performs a Three Card Spread and appends the reading at the bottom.

---

## Configuration

*No user-configurable settings at present.*
To customize spreads or meanings, edit:

* **Spreads** in main.js → `spreads` object
* **Deck** in `generateTarotDeck()`
* **Meanings** in `generateTarotMeanings()`

---

## Development

1. Modify `main.js` as needed.
2. In Obsidian, click **Reload plugins** or restart the app.
3. Open the developer console (Ctrl+Shift+I) to see load/unload logs:
   Loading Tarot Plugin
   Unloading Tarot Plugin

---

## Changelog

* **v0.1.4**

  * Initial release: single, three-card & Celtic Cross spreads; upright/reversed meanings.

---

## License

MIT © arenkis
(See LICENSE for details.)