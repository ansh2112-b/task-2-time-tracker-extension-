let activeTabId = null;
let activeDomain = null;
let startTime = null;

function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
}

// Save accumulated time
function saveTime(domain, duration) {
  if (!domain) return;
  chrome.storage.local.get([domain], (result) => {
    let total = result[domain] || 0;
    total += Math.floor(duration / 1000);
    chrome.storage.local.set({ [domain]: total });
  });
}

// When user switches tabs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (startTime && activeDomain) {
    const duration = Date.now() - startTime;
    saveTime(activeDomain, duration);
  }

  const tab = await chrome.tabs.get(activeInfo.tabId);
  activeTabId = activeInfo.tabId;
  activeDomain = getDomain(tab.url);
  startTime = Date.now();
});

// When tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    if (startTime && activeDomain) {
      const duration = Date.now() - startTime;
      saveTime(activeDomain, duration);
    }
    activeDomain = getDomain(changeInfo.url);
    startTime = Date.now();
  }
});

// On browser start
chrome.runtime.onStartup.addListener(() => {
  startTime = Date.now();
});

// ✅ Auto-save every 5 seconds so time keeps increasing live
setInterval(() => {
  if (startTime && activeDomain) {
    const duration = Date.now() - startTime;
    saveTime(activeDomain, duration);
    startTime = Date.now();
  }
}, 5000);
