# 🛡️ Phishing Guard - Chrome Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen.svg)](https://chrome.google.com/webstore)

A comprehensive anti-phishing Chrome extension that protects users from clicking unsafe links by detecting suspicious domains, typosquatting, homoglyph attacks, and other phishing techniques.

## Features

- 🛡️ **Real-time Link Protection**: Intercepts and validates links before navigation
- 🔍 **Typosquatting Detection**: Identifies domains that are suspiciously similar to trusted websites (e.g., "appl.com" vs "apple.com")
- 🚫 **Homoglyph Detection**: Detects attacks using similar-looking characters
- ⚠️ **Suspicious Pattern Detection**: Flags URLs with suspicious patterns
- 📊 **Statistics Tracking**: Keeps track of blocked links
- 🎨 **User-Friendly Warnings**: Beautiful modal dialogs to warn users about unsafe links
- ⚙️ **Customizable Settings**: Enable/disable protection and manage preferences

## Installation

### Step 1: Generate Icons

Before installing, you need to generate the extension icons:

1. Open `create-icons.html` in your web browser
2. Click each "Generate & Download" button (16x16, 48x48, 128x128)
3. Save all three downloaded PNG files to the `icons/` folder
4. Make sure they are named: `icon16.png`, `icon48.png`, and `icon128.png`

**Note:** If you don't generate icons, the extension will still work but won't have a custom icon.

### Step 2: Install Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the `Phishing-guard` folder
5. The extension is now installed and active!

## How It Works

The extension uses several detection methods:

1. **Typosquatting Detection**: Uses Levenshtein distance algorithm to detect domains that are 1-2 characters different from trusted domains
2. **Homoglyph Detection**: Identifies domains using similar-looking characters (e.g., Cyrillic 'а' instead of Latin 'a')
3. **Pattern Analysis**: Flags suspicious URL patterns like IP addresses, suspicious TLDs, and phishing keywords
4. **Trusted Domain List**: Maintains a list of well-known legitimate domains for comparison

## Usage

Once installed, the extension works automatically:

- Click any link on any webpage
- If the link is suspicious, a warning modal will appear
- You can choose to proceed anyway (not recommended) or cancel
- Check the extension popup for statistics and settings

## Testing

Use the included `test.html` page to test the extension:

1. Click the extension icon
2. Click "Test Extension"
3. Try clicking the suspicious links to see the warnings

## Files Structure

- `manifest.json` - Extension configuration
- `background.js` - Service worker for URL validation
- `content.js` - Content script that intercepts link clicks
- `urlValidator.js` - Core validation logic
- `popup.html/js` - Extension popup interface
- `options.html/js` - Settings page
- `test.html` - Test page for demonstration

## Privacy

- All URL validation happens locally in your browser
- No data is sent to external servers
- No tracking or analytics
- Your browsing data stays private

## Limitations

- The extension uses pattern matching and heuristics, not a real-time threat database
- Some legitimate but unusual domains might be flagged
- Advanced phishing techniques may not be detected
- Always use your judgment when clicking links

## Future Enhancements

Potential improvements:
- Integration with threat intelligence APIs
- Machine learning for better detection
- Whitelist/blacklist management
- More sophisticated homoglyph detection
- Support for more languages and character sets

## License

This project is provided as-is for educational and personal use.

## Support

If you encounter any issues or have suggestions, please report them through the extension's feedback mechanism.
