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
	/**
	 *
	 * 分享函数分如下三种情况：
	 * 1、来自校校App，则调取App中分享接口
	 * 2、非校校App，执行else语句
	 * @param  {object} 	options 	参数集合：
	 *            url：分享的地址
	 *            fromApp：标示是否来自校校App
	 *            fnc：非校校App时执行的函数
	 */
	exports.share = function(options) {
		var url = options.url || window.location.href,
			title = options.title || document.title,
			fromApp = options.fromApp || false,
			fnc = options.fnc;
		connectWebViewJavascriptBridge(function(bridge) {
			//用户自定义的函数都要写在这里
			osBridge = bridge;
		});
		if (fromApp && browser.versions.android) {
			window.appView.share(url, title);
		} else if (fromApp && browser.versions.iPhone) {
			osBridge.send({
				url: url,
				title: title
			});
		} else {
			fnc && fnc();
		}
	};

});