document.getElementById("openDashboard").addEventListener("click", () => {
  chrome.tabs.create({ url: "dashboard.html" });
});

const productiveSites = ["docs.google.com", "stackoverflow.com", "github.com"];
const unproductiveSites = ["youtube.com", "facebook.com", "reddit.com"];

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function updateStats() {
  chrome.storage.local.get(null, (items) => {
    let productive = 0;
    let unproductive = 0;

    for (const [domain, seconds] of Object.entries(items)) {
      if (productiveSites.includes(domain)) {
        productive += seconds;
      } else if (unproductiveSites.includes(domain)) {
        unproductive += seconds;
      }
    }

    document.getElementById("productive-time").textContent = formatTime(productive);
    document.getElementById("unproductive-time").textContent = formatTime(unproductive);
  });
}

// Run once when popup opens
document.addEventListener("DOMContentLoaded", () => {
  updateStats();
});

// ✅ Listen for live updates from background.js
chrome.storage.onChanged.addListener(() => {
  updateStats();
});
