function dressMotto() {
  document.querySelectorAll("footer .tiny").forEach((node) => {
    if (node.dataset.motto || !node.textContent.includes("Educate")) return;
    node.dataset.motto = "1";
    const text = node.textContent.replace(/Educate\s*·\s*Engage\s*·\s*Empower\.?/, "").trim();
    node.textContent = text;
    const row = document.createElement("div");
    row.className = "motto";
    ["Educate", "Engage", "Empower"].forEach((word) => {
      const chip = document.createElement("span");
      chip.textContent = word;
      row.appendChild(chip);
    });
    node.after(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  dressMotto();
});
