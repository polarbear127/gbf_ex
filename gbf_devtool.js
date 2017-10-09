
console.log("hello from devtools");
chrome.devtools.panels.create("GBF_EX",
                              "icon.png",
                              "panel/gbf_panel.html",
                              function(panel) { console.log("hello from callback"); }); 
