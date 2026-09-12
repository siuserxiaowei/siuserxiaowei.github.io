const progress = document.getElementById("reading-progress");
const tocLinks = [...document.querySelectorAll(".toc-panel a[href^='#']")];
const sections = tocLinks
  .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
  .filter(Boolean);

document.querySelectorAll("table").forEach((table) => {
  const wrap = document.createElement("div");
  wrap.className = "table-wrap";
  table.parentNode.insertBefore(wrap, table);
  wrap.appendChild(table);
});

function updateReadingState() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;

  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 140) active = section;
  }
  tocLinks.forEach((link) => {
    link.classList.toggle("active", active && decodeURIComponent(link.hash.slice(1)) === active.id);
  });
}

window.addEventListener("scroll", updateReadingState, { passive: true });
window.addEventListener("resize", updateReadingState);
updateReadingState();
