function checkAndRemoveAdsAndGifs() {
  // Expanded keyword list
  const keywords = ['adt','advertisement', 'adskeeper', 't.ly', '2ly', 'adst', 'adqva', '_adqva_', 'ph-inpage'];
  const regexAds = /\bad\b/;
  
  // Directly target known ad containers
  document.querySelectorAll('div[class*="AdQVA"]').forEach(el => el.remove());
  document.querySelectorAll('div[class*="adqva"]').forEach(el => el.remove());
  
  // More thorough attribute checking
  document.querySelectorAll('*').forEach(element => {
    let shouldRemove = false;

    // Check image sources for GIFs
    if (element instanceof HTMLImageElement) {
      const src = element.src?.toLowerCase() || '';
      const srcset = element.srcset?.toLowerCase() || '';
      const currentSrc = element.currentSrc?.toLowerCase() || '';
      if (src.endsWith('.gif') || srcset.includes('.gif') || currentSrc.includes('.gif')) {
        shouldRemove = true;
      }
    }

    // Check background-image styles
    const bgImage = getComputedStyle(element).backgroundImage.toLowerCase();
    if (bgImage.includes('.gif')) {
      shouldRemove = true;
    }

    // Check class names more thoroughly
    const className = typeof element.className === 'string' ? element.className.toLowerCase() : '';
    if (keywords.some(keyword => className.includes(keyword))) {
      shouldRemove = true;
    }

    // Check element ID
    const id = element.id?.toLowerCase() || '';
    if (keywords.some(keyword => id.includes(keyword))) {
      shouldRemove = true;
    }

    // Check all attributes
    for (const attr of element.attributes) {
      const attrValue = attr.value.toLowerCase();
      if (keywords.some(keyword => attrValue.includes(keyword) || regexAds.test(attrValue))) {
        shouldRemove = true;
        break;
      }
    }

    // Remove element if flagged
    if (shouldRemove) {
      element.remove();
    }
  });
}

// Also check for elements with specific structures that might be ads
function removeSpecificAdStructures() {
  // Target ad units directly by their structure
  document.querySelectorAll('div._AdQVA_widget_ads, div._AdQVA_ad_unit').forEach(el => el.remove());
  
  // Look for iframes that might contain ads
  document.querySelectorAll('iframe').forEach(iframe => {
    const src = iframe.src?.toLowerCase() || '';
    if (src.includes('ads') || src.includes('advert') || src.includes('banner')) {
      iframe.remove();
    }
  });
}

function handleDOMUpdate() {
  checkAndRemoveAdsAndGifs();
  removeSpecificAdStructures();
}

// Run immediately and set up observers
handleDOMUpdate();

const observer = new MutationObserver(handleDOMUpdate);
observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener('DOMContentLoaded', handleDOMUpdate);
window.addEventListener('load', handleDOMUpdate);