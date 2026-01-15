/**
 * Background Service Worker for Phishing Guard
 * Simple manual block list only.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    chrome.storage.local.get(['blockedCount', 'enabled'], (result) => {
      sendResponse({
        blockedCount: result.blockedCount || 0,
        enabled: result.enabled !== false
      });
    });
    return true;
  }

  if (request.action === 'setEnabled') {
    chrome.storage.local.set({ enabled: request.enabled }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'getBlockedSites') {
    chrome.storage.local.get(['blockedSites'], (result) => {
      sendResponse({ blockedSites: result.blockedSites || [] });
    });
    return true;
  }

  if (request.action === 'addBlockedSite') {
    chrome.storage.local.get(['blockedSites'], (result) => {
      const blockedSites = result.blockedSites || [];
      if (!blockedSites.includes(request.domain)) {
        blockedSites.push(request.domain);
        chrome.storage.local.set({ blockedSites }, () => {
          sendResponse({ success: true, blockedSites });
        });
      } else {
        sendResponse({ success: false, message: 'Domain already blocked' });
      }
    });
    return true;
  }

  if (request.action === 'removeBlockedSite') {
    chrome.storage.local.get(['blockedSites'], (result) => {
      const blockedSites = (result.blockedSites || []).filter(d => d !== request.domain);
      chrome.storage.local.set({ blockedSites }, () => {
        sendResponse({ success: true, blockedSites });
      });
    });
    return true;
  }

  if (request.action === 'recordBlocked') {
    chrome.storage.local.get(['blockedCount'], (result) => {
      const count = (result.blockedCount || 0) + 1;
      chrome.storage.local.set({ blockedCount: count }, () => {
        sendResponse({ success: true, blockedCount: count });
      });
    });
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['enabled', 'blockedCount', 'blockedSites'], (result) => {
    if (result.enabled === undefined) {
      chrome.storage.local.set({ enabled: true });
    }
    if (result.blockedCount === undefined) {
      chrome.storage.local.set({ blockedCount: 0 });
    }
    if (result.blockedSites === undefined) {
      chrome.storage.local.set({ blockedSites: [] });
    }
  });
});
