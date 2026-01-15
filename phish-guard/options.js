/**
 * Options Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const enableProtection = document.getElementById('enableProtection');
  const blockedCountEl = document.getElementById('blockedCount');
  const resetStatsBtn = document.getElementById('resetStats');

  const blockedInput = document.getElementById('blockedInput');
  const addBlockedBtn = document.getElementById('addBlocked');
  const blockedItems = document.getElementById('blockedItems');

  chrome.storage.local.get(['enabled', 'blockedCount', 'blockedSites'], (result) => {
    enableProtection.checked = result.enabled !== false;
    blockedCountEl.textContent = result.blockedCount || 0;
    loadBlockedSites(result.blockedSites || []);
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

  addBlockedBtn.addEventListener('click', () => {
    const domain = blockedInput.value.trim().toLowerCase();
    if (!domain) {
      alert('Please enter a domain');
      return;
    }

    if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/i.test(domain)) {
      alert('Please enter a valid domain (e.g., example.com)');
      return;
    }

    chrome.runtime.sendMessage(
      { action: 'addBlockedSite', domain },
      (response) => {
        if (response && response.success) {
          blockedInput.value = '';
          loadBlockedSites(response.blockedSites);
        } else {
          alert(response?.message || 'Failed to add domain');
        }
      }
    );
  });

  blockedInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addBlockedBtn.click();
    }
  });

  function loadBlockedSites(list) {
    blockedItems.innerHTML = '';
    if (list.length === 0) {
      blockedItems.innerHTML = '<div style="color: #6b7280; font-size: 14px; padding: 10px; text-align: center;">No blocked domains</div>';
      return;
    }

    list.forEach((domain) => {
      const item = document.createElement('div');
      item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 5px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;';

      const domainText = document.createElement('span');
      domainText.textContent = domain;
      domainText.style.cssText = 'font-size: 14px; color: #374151;';

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.style.cssText = 'padding: 5px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;';
      removeBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage(
          { action: 'removeBlockedSite', domain },
          (response) => {
            if (response && response.success) {
              loadBlockedSites(response.blockedSites);
            }
          }
        );
      });

      item.appendChild(domainText);
      item.appendChild(removeBtn);
      blockedItems.appendChild(item);
    });
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
