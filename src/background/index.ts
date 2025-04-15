chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.BLOCK
        },
        condition: {
          urlFilter: "advertisement",
          resourceTypes: [
            chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST, 
            chrome.declarativeNetRequest.ResourceType.SUB_FRAME
          ]
        }
      }
    ],
    removeRuleIds: [1]
  });
});

export {};

  export {};
