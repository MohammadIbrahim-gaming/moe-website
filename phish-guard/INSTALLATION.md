# Installation Guide

## Quick Start

### Option 1: Generate Icons First (Recommended)

1. **Generate Icons:**
   - Open `create-icons.html` in your web browser
   - Click each "Generate & Download" button (16x16, 48x48, 128x128)
   - Save all three files to the `icons/` folder with names: `icon16.png`, `icon48.png`, `icon128.png`

2. **Install Extension:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `Phishing-guard` folder
   - Done! The extension is now active.

### Option 2: Install Without Custom Icons

The extension will work without custom icons, but Chrome will show a default extension icon:

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `Phishing-guard` folder
5. You can generate icons later using `create-icons.html`

## Testing the Extension

1. Click the extension icon in Chrome's toolbar
2. Click "Test Extension" to open the test page
3. Try clicking the suspicious links (like "appl.com") to see warnings
4. Try clicking safe links (like "apple.com") - they should work normally

## Troubleshooting

- **Extension won't load:** Make sure all files are in the `Phishing-guard` folder
- **Icons missing:** Use `create-icons.html` to generate them, or the extension will use default Chrome icons
- **Links not being blocked:** Check that protection is enabled in the extension popup
- **Console errors:** Open Chrome DevTools (F12) and check for any error messages

## Features to Test

- ✅ Typosquatting detection (appl.com, gooogle.com)
- ✅ IP address detection
- ✅ Suspicious pattern detection
- ✅ Warning modal appearance
- ✅ Statistics tracking
- ✅ Enable/disable toggle
