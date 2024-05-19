let currentTabId;
let currentWinId;
let chatGptTabId;
let chatGptWinId;
let previousTab;
let previousWin;
const BASE_URL = "chatgpt.com";

function queryTab() {
    return browser.tabs.query({ url: `*://${BASE_URL}/*`, currentWindow: true });
}

function onError(e) {
    console.log("***Error: " + e);
};

function setButtonIcon(imageURL) {
    try {
        browser.browserAction.setIcon({ path: imageURL });
    } catch (e) {
        onError(e);
    }
};

function createPinnedTab() {
    browser.tabs.create(
        {
            url: `https://${BASE_URL}`,
            pinned: true,
            active: true
        }
    )
};

function handleSearch(chatGptTabs) {
    //console.log("currentTabId: " + currentTabId);
    //console.log("currentWinId: " + currentWinId);
    if (chatGptTabs.length > 0) {
        //console.log("there is a chatGpt tab");
        chatGptTabId = chatGptTabs[0].id;
        chatGptWinId = chatGptTabs[0].windowId;
        if (chatGptTabId === currentTabId) {
            //console.log("I'm in the chatGpt tab");
            browser.windows.update(previousWin, { focused: true })
            browser.tabs.update(previousTab, { active: true, });
        } else {
            //console.log("I'm NOT in the chatGpt tab");
            previousTab = currentTabId;
            previousWin = currentWinId;
            browser.windows.update(chatGptWinId, { focused: true, });
            browser.tabs.update(chatGptTabId, { active: true, });
        }
        setButtonIcon(chatGptTabs[0].favIconUrl);
    } else {
        //console.log("there is NO chatGpt tab");
        previousTab = currentTabId;
        createPinnedTab();
    }
};

function handleClick(tab) {
    //console.log("*********Button clicked*********");
    currentTabId = tab.id;
    currentWinId = tab.windowId;
    let querying = queryTab();
    querying.then(handleSearch, onError);
};

function update(details) {
    if (details.reason === "install" || details.reason === "update") {
        browser.runtime.openOptionsPage();
    }
};

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);