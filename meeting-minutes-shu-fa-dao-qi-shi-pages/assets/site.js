(() => {
  const search = document.querySelector("#search");
  const cards = Array.from(document.querySelectorAll(".article-card[data-title]"));
  const filterButtons = Array.from(document.querySelectorAll(".tag-filter"));

  if (!search || cards.length === 0) {
    return;
  }

  let activeTag = "";

  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    for (const card of cards) {
      const haystack = [
        card.dataset.title || "",
        card.dataset.tags || "",
        card.textContent || "",
      ].join(" ").toLowerCase();
      const tagMatch = !activeTag || (card.dataset.tags || "").split(" ").includes(activeTag);
      const textMatch = query.length === 0 || haystack.includes(query);
      card.hidden = !(tagMatch && textMatch);
    }
  }

  search.addEventListener("input", applyFilters);

  for (const button of filterButtons) {
    button.addEventListener("click", () => {
      activeTag = button.dataset.filterTag || "";
      for (const item of filterButtons) {
        item.classList.toggle("active", item === button);
      }
      applyFilters();
    });
  }
})();
