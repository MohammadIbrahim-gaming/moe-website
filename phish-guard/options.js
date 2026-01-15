/**
 * Options Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const enableProtection = document.getElementById('enableProtection');
  const blockedCountEl = document.getElementById('blockedCount');
  const resetStatsBtn = document.getElementById('resetStats');

  const blockedItems = document.getElementById('blockedItems');

  chrome.storage.local.get(['enabled', 'blockedCount'], (result) => {
    enableProtection.checked = result.enabled !== false;
    blockedCountEl.textContent = result.blockedCount || 0;
    loadBlockedSites();
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

  async function loadBlockedSites() {
    blockedItems.innerHTML = '';
    try {
      const response = await fetch(chrome.runtime.getURL('blockedSites.json'));
      if (!response.ok) {
        blockedItems.innerHTML = '<div style="color: #6b7280; font-size: 14px; padding: 10px; text-align: center;">No blocked domains</div>';
        return;
      }
      const list = await response.json();
      if (!Array.isArray(list) || list.length === 0) {
        blockedItems.innerHTML = '<div style="color: #6b7280; font-size: 14px; padding: 10px; text-align: center;">No blocked domains</div>';
        return;
      }

      list.forEach((domain) => {
        const item = document.createElement('div');
        item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 5px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;';

        const domainText = document.createElement('span');
        domainText.textContent = domain;
        domainText.style.cssText = 'font-size: 14px; color: #374151;';

        item.appendChild(domainText);
        blockedItems.appendChild(item);
      });
    } catch (error) {
      blockedItems.innerHTML = '<div style="color: #6b7280; font-size: 14px; padding: 10px; text-align: center;">Unable to load blocked domains</div>';
      return;
    }
  }

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
