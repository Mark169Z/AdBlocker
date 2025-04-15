// Function to check if any attribute of an element contains "advertisement" or "ads"
// Also removes any GIF images
function checkAndRemoveAdsAndGifs() {
  // Get all elements in the document
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach(element => {
    let shouldRemove = false;
    
    // Check if it's a GIF image
    if (element instanceof HTMLImageElement) {
      const src = element.src || '';
      const srcset = element.srcset || '';
      const currentSrc = element.currentSrc || '';
      
      // Check if the image source ends with .gif or contains .gif in srcset or currentSrc
      if (src.toLowerCase().endsWith('.gif') || 
          srcset.toLowerCase().includes('.gif') ||
          currentSrc.toLowerCase().includes('.gif') ||
          (element.src && element.src.toLowerCase().endsWith('.gif')) ||
          (element.currentSrc && element.currentSrc.toLowerCase().endsWith('.gif')) 
        ) {
        shouldRemove = true;
      }
    }
    
    // Also check for GIFs in background images
    const style = window.getComputedStyle(element);
    const backgroundImage = style.backgroundImage || '';
    if (backgroundImage.toLowerCase().includes('.gif')) {
      shouldRemove = true;
    }
    
// If not already flagged for removal, check each attribute for "advertisement" or the whole word "ads"
if (!shouldRemove) {
  for (const attr of element.attributes) {
    const attrValue = attr.value.toLowerCase();
    const regexAds = /\bads\b/; // Regular expression for the whole word "ads"
    if (
      attrValue.includes('advertisement') || 
      regexAds.test(attrValue) ||
      attrValue.includes('t.ly') ||
      attrValue.includes('2ly') ||
      (attr.name === 'id' && (
        attrValue.includes('adst') ||
        attrValue.includes('2ly') ||
        attrValue.includes('t.ly') 
        ))) {
      shouldRemove = true;
      break;
    }
  }
}
    
    // Remove the element if it meets any of our criteria
    if (shouldRemove) {
      element.remove();
    }
  });
}

// Function to run on DOM updates
function handleDOMUpdate() {
  checkAndRemoveAdsAndGifs();
}

// Run immediately
handleDOMUpdate();

// Set up an observer to handle dynamically added content
const observer = new MutationObserver(() => {
  handleDOMUpdate();
});

// Start observing the document for added nodes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// You can also listen for other types of DOM updates if needed
document.addEventListener('DOMContentLoaded', handleDOMUpdate);
window.addEventListener('load', handleDOMUpdate);