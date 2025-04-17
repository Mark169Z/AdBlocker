import { useState, useEffect } from 'react';

export default function App() {
    const [isAdBlockerEnabled, setIsAdBlockerEnabled] = useState(true);

    useEffect(() => {
        // Load the current state when component mounts
        chrome.storage.sync.get(['adBlockerEnabled'], (result) => {
            // Default to true if not set
            setIsAdBlockerEnabled(result.adBlockerEnabled !== false);
        });
    }, []);

    const handleToggle = () => {
        const newState = !isAdBlockerEnabled;
        setIsAdBlockerEnabled(newState);
        
        // Save to storage
        chrome.storage.sync.set({ adBlockerEnabled: newState });
        
        // Send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: 'toggleAdBlocker', 
                    enabled: newState 
                });
            }
        });
    };
    return (
        <main>
            <h1>Ad Blocker</h1>
             <p>Toggle the switch to enable or disable the ad blocker.</p>
             <label className="switch">
                 <input type="checkbox" checked={isAdBlockerEnabled} onChange={handleToggle} />
                 <span className="slider round"></span>
             </label>
        </main>
    );
}

//     return (
//         <main>
//             <h1>Ad Blocker</h1>
//             <p>Toggle the switch to enable or disable the ad blocker.</p>
//             <label className="switch">
//                 <input type="checkbox" checked={isAdBlockerEnabled} onChange={handleToggle} />
//                 <span className="slider round"></span>
//             </label>
//             <p>{isAdBlockerEnabled ? 'Ad Blocker is enabled' : 'Ad Blocker is disabled'}</p>
//         </main>
//     );
// }
