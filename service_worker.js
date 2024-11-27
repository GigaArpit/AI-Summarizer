const contextHandler = async (info, tab) => {
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
        chrome.sidePanel.open({tabId: tab.id});
    });
};

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'sidePanelPort') {
        port.onDisconnect.addListener(() => {
            chrome.storage.local.clear(() => {
                if (chrome.runtime.lastError) {
                    console.error('Error clearing storage:', chrome.runtime.lastError);
                } else {
                    console.log('Storage cleared successfully.');
                }
            });
        });
    }
});





chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.create({
        "title": "AI Summarizer",
        "id": "aisummarizer-extension",
        "contexts": ["selection"]
    });
    
    chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true });
    
    if (details.reason == "install") {
        chrome.tabs.create({
            "url": "https://github.com/gigaArpit/AI-Summarizer/blob/main/docs/extension-welcome.md"
        });
    }
});


chrome.contextMenus.onClicked.addListener(contextHandler);