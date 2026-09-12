"use strict";

(function normalizeRootHomepageLinks() {
  const content = window.learningHubContent;
  if (!content) return;

  const normalizeHref = (href) => {
    if (typeof href !== "string") return href;
    return href.startsWith("../") ? href.slice(3) : href;
  };

  if (Array.isArray(content.pathSteps)) {
    content.pathSteps.forEach((step) => {
      step.href = normalizeHref(step.href);
    });
  }

  if (Array.isArray(content.topics)) {
    content.topics.forEach((topic) => {
      if (!Array.isArray(topic.cards)) return;
      topic.cards.forEach((card) => {
        if (Array.isArray(card.sourceUrls)) {
          card.sourceUrls = card.sourceUrls.map(normalizeHref);
        }
      });
    });
  }
})();
