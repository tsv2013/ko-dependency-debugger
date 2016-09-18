
$(function() {
	//abstraction wrapper around extension api, stolen from batarang :)
	// var chromeExtension = {
	// 	sendRequest: function(requestName, cb) {
	// 		chrome.extension.sendRequest({
	// 		script: requestName,
	// 		tab: chrome.devtools.inspectedWindow.tabId
	// 		}, cb || function () {});
	// 	},
	//
	// 	eval: function(fn, args, cb) {
	// 		// with two args
	// 		if (!cb && typeof args === 'function') {
	// 			cb = args;
	// 			args = {};
	// 		} else if (!args) {
	// 			args = {};
	// 		}
	// 		chrome.devtools.inspectedWindow.eval('(' +
	// 			fn.toString() +
	// 			'(window, ' +
	// 			JSON.stringify(args) +
	// 			'));', cb);
	// 	},
	// 	watchRefresh: function (cb) {
	// 		var port = chrome.extension.connect();
	// 		port.postMessage({
	// 			action: 'register',
	// 			inspectedTabId: chrome.devtools.inspectedWindow.tabId
	// 		});
	// 		port.onMessage.addListener(function(msg) {
	// 			if (msg === 'refresh' && cb) {
	// 				cb();
	// 			}
	// 		});
	// 		port.onDisconnect.addListener(function (a) {
	// 			console.log(a);
	// 		});
	// 	}
	// };

	var attachExtender = function(globalWindowObj) {

	};

	var chromeExtensionEvalCallback = function(promise) {
		//disable the button so you can only attach the extender once
		$("#enableTracing").text("Tracing enabled").attr("disabled", "disabled");
	};

	$("#enableTracing").click(function() {
		chromeExtension.eval(attachExtender, true, chromeExtensionEvalCallback);
	});

	chromeExtension.watchRefresh(function() {
		$("#enableTracing").text("Enable Tracing").removeAttr("disabled");
	});

});
