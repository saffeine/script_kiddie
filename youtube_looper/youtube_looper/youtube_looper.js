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