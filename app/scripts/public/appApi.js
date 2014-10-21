define(function(require, exports, module) {
	var browser = require('scripts/public/browser').browser,
		osBridge;


	//用于创建桥接对象的函数
	function connectWebViewJavascriptBridge(callback) {
		//如果桥接对象已存在，则直接调用callback函数
		if (window.WebViewJavascriptBridge) {
			callback(WebViewJavascriptBridge)
		}
		//否则添加一个监听器来执行callback函数
		else {
			document.addEventListener('WebViewJavascriptBridgeReady',
				function() {
					callback(WebViewJavascriptBridge)
				}, false)
		}
	}
	exports.share = function(url) {
		url = url || window.location.href;
		connectWebViewJavascriptBridge(function(bridge) {
			//用户自定义的函数都要写在这里
			osBridge = bridge;
		});
		if (browser.versions.android) {
			window.appView.share(url);
		} else if (browser.versions.iPhone) {
			osBridge.send(url);
		} else {
			alert(url);
		}
	};

});