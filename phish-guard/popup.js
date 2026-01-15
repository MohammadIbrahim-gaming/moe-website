/**
 * Popup Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggleEnabled = document.getElementById('toggleEnabled');
  const blockedCountEl = document.getElementById('blockedCount');
  const openOptionsBtn = document.getElementById('openOptions');

  // Load current settings
  chrome.storage.local.get(['enabled', 'blockedCount'], (result) => {
    toggleEnabled.checked = result.enabled !== false;
    blockedCountEl.textContent = result.blockedCount || 0;
  });

  // Toggle protection
  toggleEnabled.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    chrome.runtime.sendMessage(
      { action: 'setEnabled', enabled: enabled },
      (response) => {
        if (response && response.success) {
          chrome.storage.local.set({ enabled: enabled });
        }
      }
    );
  });

  // Open options page
  openOptionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Update stats periodically
  setInterval(() => {
    chrome.runtime.sendMessage({ action: 'getStats' }, (response) => {
      if (response) {
        blockedCountEl.textContent = response.blockedCount || 0;
        toggleEnabled.checked = response.enabled !== false;
      }
    });
  }, 1000);
});
