const geminiNanoError = "⚠️ Error: Gemini Nano not available. <br/>Make sure you follow <a href='https://github.com/GigaArpit/BrowserAI/docs/extension-welcome.md' target='_blank'>these steps</a> to enable the Gemini Nano in your browser.";

const updateSummary = (text) => {
    document.getElementById('summary').innerHTML = text;
};

async function summarizeText(inputText) {
    if (!window.ai || !window.ai.summarizer) {
        console.error("AI Summarizer is not available.");
        return geminiNanoError;
    }
    
    try {
        // Check capabilities first
        const capabilities = await window.ai.summarizer.capabilities();
        if (capabilities.available !== "readily" && capabilities.available !== "after-download") {
            console.warn("Summarizer is not supported or unavailable.");
            return "Summarizer is not supported or unavailable.";
        }

        document.getElementById('summary').innerHTML = "Summarizing...";
        
        // Create a summarizer instance
        const summarizer = await window.ai.summarizer.create({
            type: 'key-points',
            format: 'plain-text',
            length: 'medium',
        });

        const summary = await summarizer.summarize(inputText);
        
        // Destroy the summarizer instance after use
        summarizer.destroy();
        
        // Display the summary
        return summary;
    } catch (error) {
        console.error("Error during summarization:", error);
        return "Error during summarization. Please try again later.";
    }
}

chrome.storage.local.get('selectedText', async ({ selectedText  }) => {
    if(selectedText === undefined) {
        updateSummary("Select some text, and use extension's context menu option to see result here.");
    } else {
        if (!window.ai || !window.ai.summarizer) {
            console.error("AI Summarizer is not available.");
            updateSummary(geminiNanoError);
        }
        
        else {
            let summary = await summarizeText(selectedText);
            if (summary) {
                updateSummary(summary);
            } else {
                updateSummary("Gemini Nano failed to generate a summary. Please try again later.");
            }
        }
        
    };
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.selectedText) {
        if (!window.ai || !window.ai.summarizer) {
            console.error("AI Summarizer is not available.");
            updateSummary(geminiNanoError);
        }
        
        else summarizeText(changes.selectedText.newValue).then((summary) => {
            if (summary) {
                updateSummary(summary);
            } else {
                updateSummary("Gemini Nano failed to generate a summary. Please try again later.");
            }
        });
    }
});

const port = chrome.runtime.connect({ name: 'sidePanelPort' });