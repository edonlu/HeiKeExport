chrome.runtime.onInstalled.addListener(function(){
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    // ֻ�д򿪰ٶȲ���ʾpageAction
                    new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'heikeyun.net'}})
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});