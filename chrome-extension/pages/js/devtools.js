var getValueFromLocalStorage = function(key, defaultValue) {
	var localStorageValue = undefined;
	try {
		localStorageValue = localStorage[key];
	}
	catch(e) {
		console.log("Unable to get value from localstorage. Check the privacy settings of chrome", e);
	}
	var result = defaultValue;
	if(localStorageValue) {
		result = JSON.parse(localStorageValue);
	}
	return result;
}

// The function is executed in the context of the inspected page.
var page_getKnockoutInfo = function() {
	"use strict";
	var debug = function(m) {
		//console.log(m);
	};
	var ko = window.ko;

	if(!ko){
		if(typeof window.require === 'function') {
			var isDefinedAvailable = typeof window.require.defined === 'function';
			try{
				if((isDefinedAvailable && require.defined('ko')) || !isDefinedAvailable ) {
					ko = require('ko');
				}
			} catch(e) { /*ingore */ }
			if(!ko){
				try{
					if((isDefinedAvailable && require.defined('knockout')) || !isDefinedAvailable ) {
						ko = require('knockout');
					}
				} catch(e) { /*ingore */ }
			}
		}
		if(!ko) {
			return { error: "knockout.js is not used in the page (ko is undefined). Maybe you are using iFrames, if so, browse to the url of the frame and try again." };
		}
	}

	var context = $0 ? ko.contextFor($0) : {};
	debug("context ");
	debug(context);
	var dataFor = $0 ? ko.dataFor($0): {};

	return {};
};

alert(Object.keys(chrome.devtools.panels.sources));

chrome.devtools.panels.sources.createSidebarPane("KO Dependencies", function(sidebar) {
	"use strict";
	//debugger;
	//console.log("%o", "sidebar");
	//alert("!");
	// sidebar.onShown.addListener(function(sb) {
	// 	alert("!!");
	// });

	sidebar.setPage("/pages/sidebar.html");
	//sidebar.setHeight("200px");
	//sidebar.setExpression("(function() { return 'a'; })()", "Test");

	function updateElementProperties(sb) {
		alert(Object.keys(sidebar));
		//sidebar.setObject({"a": "1"}, "Object");
		//sidebar.setHeight("8ex");
		//sidebar.setExpression("(function() { return 'a'; })()", "Test");
		//pase a function as a string that will be executed later on by chrome
		//sidebar.setExpression("(" + page_getKnockoutInfo.toString() + ")("+"{}"/*shouldDoKOtoJS*/+")", "Shit!\n\n\n\n\nqwerwetertertery", function() {});

		// if(shouldAddEditMethod){
		// 	chrome.devtools.inspectedWindow.eval("("+createEditMethods.toString()+ ")()");
		// }
	}
	//initial
	updateElementProperties();
	//attach to chrome events so that the sidebarPane refreshes (contains up to date info)
	chrome.devtools.panels.sources.onSelectionChanged.addListener(updateElementProperties);
	sidebar.onShown.addListener(updateElementProperties);

  //listen to a message send by the background page (when the chrome windows's focus changes)
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
      updateElementProperties();
  });

});

var shouldPanelBeShown = getValueFromLocalStorage("shouldPanelBeShown", false);
if(shouldPanelBeShown) {
	var knockoutPanel = chrome.devtools.panels.create(
		"KO Dependencies",
		"logo.png",
		"/pages/panel.html"
	);
}
