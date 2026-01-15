/**
 * Options Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const enableProtection = document.getElementById('enableProtection');
  const blockedCountEl = document.getElementById('blockedCount');
  const resetStatsBtn = document.getElementById('resetStats');

  chrome.storage.local.get(['enabled', 'blockedCount'], (result) => {
    enableProtection.checked = result.enabled !== false;
    blockedCountEl.textContent = result.blockedCount || 0;
  });

  enableProtection.addEventListener('change', (event) => {
    const enabled = event.target.checked;
    chrome.runtime.sendMessage(
      { action: 'setEnabled', enabled },
      (response) => {
        if (response && response.success) {
          chrome.storage.local.set({ enabled });
        }
      }
    );
  });

  resetStatsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the statistics?')) {
      chrome.storage.local.set({ blockedCount: 0 }, () => {
        blockedCountEl.textContent = 0;
      });
    }
  });

  setInterval(() => {
    chrome.storage.local.get(['blockedCount'], (result) => {
      blockedCountEl.textContent = result.blockedCount || 0;
    });
  }, 1000);
});
