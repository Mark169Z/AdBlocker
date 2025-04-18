let adBlockerEnabled = true;
const hiddenElements = new Set();

function hideElement(element) {
  if (!hiddenElements.has(element)) {
    element.style.setProperty('display', 'none', 'important');
    hiddenElements.add(element);
  }
}

function showHiddenElements() {
  hiddenElements.forEach(element => {
    if (element && element.style) {
      element.style.removeProperty('display');
    }
  });
  hiddenElements.clear();
}

function checkAndHideAdsAndGifs() {
  if (!adBlockerEnabled) return;

  // Expanded keyword list
  const keywords = ['adt','advertisement', 'adskeeper', 't.ly', '2ly', 'adst', 'adqva', '_adqva_', 'ph-inpage'];
  const regexAds = /\bad\b/;
  
  // Directly target known ad containers
  document.querySelectorAll('div[class*="AdQVA"]').forEach(el => hideElement(el));
  document.querySelectorAll('div[class*="adqva"]').forEach(el => hideElement(el));
  
  // More thorough attribute checking
  document.querySelectorAll('*').forEach(element => {
    let shouldHide = false;

    // Check image sources for GIFs
    if (element instanceof HTMLImageElement) {
      const src = element.src?.toLowerCase() || '';
      const srcset = element.srcset?.toLowerCase() || '';
      const currentSrc = element.currentSrc?.toLowerCase() || '';
      if (src.endsWith('.gif') || srcset.includes('.gif') || currentSrc.includes('.gif')) {
        shouldHide = true;
      }
    }

    // Check background-image styles
    const bgImage = getComputedStyle(element).backgroundImage.toLowerCase();
    if (bgImage.includes('.gif')) {
      shouldHide = true;
    }

    // Check class names more thoroughly
    const className = typeof element.className === 'string' ? element.className.toLowerCase() : '';
    if (keywords.some(keyword => className.includes(keyword))) {
      shouldHide = true;
    }

    // Check element ID
    const id = element.id?.toLowerCase() || '';
    if (keywords.some(keyword => id.includes(keyword))) {
      shouldHide = true;
    }

    // Check all attributes
    for (const attr of element.attributes) {
      const attrValue = attr.value.toLowerCase();
      if (keywords.some(keyword => attrValue.includes(keyword) || regexAds.test(attrValue))) {
        shouldHide = true;
        break;
      }
    }

    // Hide element if flagged
    if (shouldHide) {
      hideElement(element);
    }
  });
}

// Also check for elements with specific structures that might be ads
function hideSpecificAdStructures() {
  if (!adBlockerEnabled) return;

  // Target ad units directly by their structure
  document.querySelectorAll('div._AdQVA_widget_ads, div._AdQVA_ad_unit').forEach(el => hideElement(el));
  
  // Look for iframes that might contain ads
  document.querySelectorAll('iframe').forEach(iframe => {
    const src = iframe.src?.toLowerCase() || '';
    if ( src.includes('advert') || src.includes('banner')) {
      hideElement(iframe);
    }
  });
}

function handleDOMUpdate() {
  if (adBlockerEnabled) {
    checkAndHideAdsAndGifs();
    hideSpecificAdStructures();
  }
}

// Initialize observer
let observer = null;

function setupObserver() {
  if (adBlockerEnabled) {
    if (!observer) {
      observer = new MutationObserver(handleDOMUpdate);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  } else if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Load the current state from storage
chrome.storage.sync.get(['adBlockerEnabled'], (result) => {
  adBlockerEnabled = result.adBlockerEnabled !== false; // Default to true if not set
  
  if (adBlockerEnabled) {
    handleDOMUpdate();
    setupObserver();
  }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggleAdBlocker') {
    adBlockerEnabled = message.enabled;
    
    if (adBlockerEnabled) {
      handleDOMUpdate(); // Clean up immediately when enabled
      setupObserver();
    } else {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      showHiddenElements(); // Show previously hidden elements
    }
  }
  return true;
});

// Set up initial event listeners
window.addEventListener('DOMContentLoaded', () => {
  if (adBlockerEnabled) handleDOMUpdate();
});
window.addEventListener('load', () => {
  if (adBlockerEnabled) handleDOMUpdate();
});