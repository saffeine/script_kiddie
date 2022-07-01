chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
    var url = (tab.url);
    console.log(url);
    console.log(url.indexOf("watch?"));
    if(url.indexOf("watch?") == -1){ return; }

    chrome.scripting.executeScript({
        target: {tabId: tabID},
        func: function(e){
            if(typeof(sf_youloop_loaded) != "undefined"){ return; }

            var stylesheet = document.createElement("link");
            stylesheet.rel = "stylesheet";
            stylesheet.href = chrome.runtime.getURL("looper/looper.css");
            stylesheet.setAttribute("id", "sf_youloop_stylesheet");
            document.body.appendChild(stylesheet);

            var script = document.createElement("script");
            script.src = chrome.runtime.getURL("looper/looper.js");
            document.body.appendChild(script);

            var exturlelement = document.createElement("a");
            exturlelement.setAttribute("id", "sfexturl");
            exturlelement.setAttribute("content", chrome.runtime.getURL(""));
            document.body.appendChild(exturlelement);
            sf_youloop_loaded = true;
        }
    });

    return;
});

/*
var stylesheet = document.createElement("link");
stylesheet.rel = "stylesheet";
stylesheet.href = chrome.runtime.getURL("looper.css");
document.body.appendChild(stylesheet);

var script = document.createElement("script");
script.src = chrome.runtime.getURL("looper.js");
document.body.appendChild(script);

var exturlelement = document.createElement("a");
exturlelement.setAttribute("id", "sfexturl");
exturlelement.setAttribute("content", chrome.runtime.getURL(""));
document.body.appendChild(exturlelement);
*/