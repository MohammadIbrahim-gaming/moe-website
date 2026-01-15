/**
 * Content Script - manual block list only
 */

let isEnabled = true;
let blockedSites = [];

function normalizeDomain(input) {
  if (!input) return '';
  return input.toLowerCase().replace(/^www\./, '');
}

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return normalizeDomain(urlObj.hostname);
  } catch (error) {
    return normalizeDomain(url);
  }
}

function isDomainBlocked(domain) {
  if (!domain) return false;
  return blockedSites.some((blocked) => {
    const normalizedBlocked = normalizeDomain(blocked);
    return domain === normalizedBlocked || domain.endsWith('.' + normalizedBlocked);
  });
}

function recordBlocked() {
  chrome.runtime.sendMessage({ action: 'recordBlocked' });
}

function showBlockedOverlay(domain) {
  const existing = document.getElementById('phish-guard-blocked');
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'phish-guard-blocked';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.9);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 28px;
    width: min(90%, 460px);
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  `;

  card.innerHTML = `
    <div style="font-size: 40px; margin-bottom: 12px;">⛔</div>
    <h2 style="margin: 0 0 10px; font-size: 22px; color: #0f172a;">
      Site blocked
    </h2>
    <p style="margin: 0 0 20px; color: #475569; font-size: 14px;">
      This domain is on your manual block list: <strong>${domain}</strong>
    </p>
    <button id="phish-guard-leave" style="
      padding: 10px 18px;
      border: none;
      border-radius: 6px;
      background: #ef4444;
      color: white;
      cursor: pointer;
      font-weight: 600;
    ">Leave site</button>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  document.getElementById('phish-guard-leave').addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.replace('about:blank');
    }
  });
}

function handleBlockedNavigation(url, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
  recordBlocked();
  showBlockedOverlay(extractDomain(url));
}

function interceptClicks() {
  document.addEventListener('click', (event) => {
    if (!isEnabled) return;

    let target = event.target;
    let link = null;
    while (target && target !== document.body) {
      if (target.tagName === 'A' && target.href) {
        link = target;
        break;
      }
      target = target.parentElement;
    }

    if (!link) return;
    const url = link.href;
    if (!url || url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return;
    }

    const domain = extractDomain(url);
    if (isDomainBlocked(domain)) {
      handleBlockedNavigation(url, event);
    }
  }, true);
}

function checkCurrentPage() {
  if (!isEnabled) return;
  const currentDomain = extractDomain(window.location.href);
  if (isDomainBlocked(currentDomain)) {
    recordBlocked();
    showBlockedOverlay(currentDomain);
  }
}

function loadSettings() {
  chrome.storage.local.get(['enabled', 'blockedSites'], (result) => {
    isEnabled = result.enabled !== false;
    blockedSites = result.blockedSites || [];
    checkCurrentPage();
  });
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    isEnabled = changes.enabled.newValue;
  }
  if (changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue || [];
  }
});

loadSettings();
interceptClicks();
