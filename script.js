document.addEventListener("DOMContentLoaded", () => {
  loadCSV("listings.csv");

  document.getElementById("csvUpload").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => parseCSV(event.target.result);
      reader.readAsText(file);
    }
  });
});

function loadCSV(path) {
  fetch(path)
    .then(res => res.text())
    .then(text => parseCSV(text));
}

function parseCSV(data) {
  const rows = data.split('\n').filter(r => r.trim());
  const headers = rows.shift().split(',');

  const items = rows.map(row => {
    const values = row.split(',');
    return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i]?.trim() ?? '']));
  });

  renderListings(items);
}

function renderListings(items) {
  const container = document.getElementById("product-list");
  container.innerHTML = '';

  items.forEach(item => {
    const el = document.createElement("div");
    el.className = "product";

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = item.image;
    img.alt = item.title;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const [r, g, b] = colorThief.getColor(img);
        document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      } catch (e) {}
    };

    el.appendChild(img);
    el.innerHTML += `
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <p><strong>${item.price}</strong></p>
      <a href="${item.url}" target="_blank">View</a>
    `;

    container.appendChild(el);
  });
}
