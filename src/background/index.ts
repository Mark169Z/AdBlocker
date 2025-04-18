let adBlockerEnabled = true;

// Function to update the blocking rules
function updateBlockingRules(enabled) {
  if (enabled) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 1,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "advertisement|\\bads\\b|adst",
            resourceTypes: ["xmlhttprequest", "sub_frame", "media"]
          }
        },
        {
          id: 2,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "||googles.video/",
            resourceTypes: ["media"]
          }
        },
        {
          id: 3,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "*://*/source/weplay.mp4",
            resourceTypes: ["media"]
          }
        },
        {
          id: 4,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "*://*/banner/*.gif",
            resourceTypes: ["image"]
          }
        },
        {
          id: 5,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "*://*/banner/*.png",
            resourceTypes: ["image"]
          }
        },
        {
          id: 6,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "*://*/banner/*.webp",
            resourceTypes: ["image"]
          }
        },
        {
          id: 7,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "*://*/banner/*.jpg",
            resourceTypes: ["image"]
          }
        },
        {
          id: 8,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "*://s-img.adskeeper.com/",
            resourceTypes: ["image"]
          }
        }
      ],
      removeRuleIds: [1, 2, 3, 4, 5, 6, 7, 8]
    });
  } else {
    // Remove all rules when disabled
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3, 4, 5, 6, 7, 8],
      addRules: []
    });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  // Set default state in storage
  chrome.storage.sync.get(['adBlockerEnabled'], (result) => {
    if (result.adBlockerEnabled === undefined) {
      chrome.storage.sync.set({ adBlockerEnabled: true });
    }
    adBlockerEnabled = result.adBlockerEnabled !== false;
    updateBlockingRules(adBlockerEnabled);
  });
});

// Listen for changes to the adBlockerEnabled setting
chrome.storage.onChanged.addListener((changes) => {
  if (changes.adBlockerEnabled) {
    adBlockerEnabled = changes.adBlockerEnabled.newValue;
    updateBlockingRules(adBlockerEnabled);
  }
});
