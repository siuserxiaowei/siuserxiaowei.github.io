"use strict";

(function setupGoogleAdsTracking() {
  const config = window.GOOGLE_ADS_CONFIG || {};
  const isEnabled = config.enabled === true && Boolean(config.conversionId);
  const conversionLabels = config.conversions || {};

  function loadGoogleTag() {
    if (!isEnabled || document.querySelector("script[data-google-ads-tag]")) return;

    const script = document.createElement("script");
    script.async = true;
    script.dataset.googleAdsTag = "true";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.conversionId)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", config.conversionId);
  }

  function trackConversion(name) {
    if (!isEnabled) return;

    const label = conversionLabels[name];
    if (!label || typeof window.gtag !== "function") return;

    window.gtag("event", "conversion", {
      send_to: `${config.conversionId}/${label}`
    });
  }

  loadGoogleTag();

  document.addEventListener("click", event => {
    const target = event.target.closest("[data-conversion]");
    if (!target) return;

    trackConversion(target.dataset.conversion);
  });

  window.learningHubTrackConversion = trackConversion;
})();
