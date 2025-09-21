const productiveSites = ["docs.google.com", "stackoverflow.com", "github.com"];
const unproductiveSites = ["youtube.com", "facebook.com", "reddit.com"];

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function renderTable() {
  chrome.storage.local.get(null, (items) => {
    const tbody = document.getElementById("data");
    tbody.innerHTML = "";

    for (const [domain, seconds] of Object.entries(items)) {
      const tr = document.createElement("tr");

      // Website
      const tdWebsite = document.createElement("td");
      tdWebsite.textContent = domain;

      // Time
      const tdTime = document.createElement("td");
      tdTime.textContent = formatTime(seconds);

      // Category
      const tdCategory = document.createElement("td");
      let categoryClass = "";
      let categoryText = "Neutral";

      if (productiveSites.includes(domain)) {
        categoryClass = "productive";
        categoryText = "Productive";
      } else if (unproductiveSites.includes(domain)) {
        categoryClass = "unproductive";
        categoryText = "Unproductive";
      }

      tdCategory.innerHTML = `<span class="category ${categoryClass}">${categoryText}</span>`;

      tr.appendChild(tdWebsite);
      tr.appendChild(tdTime);
      tr.appendChild(tdCategory);

      tbody.appendChild(tr);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderTable();
  setInterval(renderTable, 5000);
});
