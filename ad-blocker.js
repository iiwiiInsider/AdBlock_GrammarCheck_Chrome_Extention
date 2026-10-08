const adBlockerStyleId = 'typing-auto-spell-correcter-ad-blocker';

const adSelectors = [
  '[data-ad]',
  '[data-ad-slot]',
  '[data-ad-client]',
  '[data-adunit]',
  '[data-ad-unit]',
  '[data-advertisement]',
  '[aria-label*="advertisement" i]',
  '[class~="ad" i]',
  '[class~="ads" i]',
  '[class*="advert" i]',
  '[id*="advert" i]',
  '[id^="google_ads_" i]',
  '[id^="div-gpt-ad" i]',
  '[class*="adsbygoogle" i]',
  '[class*="sponsored" i]',
  '[id*="sponsored" i]',
  'iframe[src*="doubleclick.net" i]',
  'iframe[src*="googlesyndication.com" i]',
  'iframe[src*="adservice.google." i]',
  'iframe[src*="amazon-adsystem.com" i]',
  'iframe[src*="adnxs.com" i]',
  'iframe[src*="taboola.com" i]',
  'iframe[src*="outbrain.com" i]'
];

function injectAdBlockerStyles() {
  if (!document.documentElement) {
    return false;
  }

  if (document.getElementById(adBlockerStyleId)) {
    return true;
  }

  const style = document.createElement('style');
  style.id = adBlockerStyleId;
  style.textContent = `${adSelectors.join(',\n')} {
    display: none !important;
    visibility: hidden !important;
  }`;
  (document.head || document.documentElement).appendChild(style);
  return true;
}

if (!injectAdBlockerStyles()) {
  const observer = new MutationObserver(() => {
    if (injectAdBlockerStyles()) {
      observer.disconnect();
    }
  });
  observer.observe(document, { childList: true, subtree: true });
}
