define(function(require, exports, module) {
	var Q = require('sui/async/q');
	/**
	 * 全局异步请求处理器
	 * @required Q.js jQuery
	 * @param {Object} data [Ajax参数]
	 * @param {Boolean} options [传true会跳到homepage]
	 * @example
	 * {
	 *     url: '/api/session/create',
	 *     type: 'post',
	 *     dataType: 'json'
	 * }
	 * @return {Q Promise} [200返回代码，handle函数处理服务器返回的异常;其他错误抛出WebService错误]
	 */
	exports.globalResponseHandler = function(data, options) {
		var handle = function(data) {
			var homepage = "/home/index.html";
			switch (data.status) {
				case 'OK':
					return data;
					break;
				case 'Error':
					throw data.message;
					break;
				case 'Expired':
					/**
					 * Fix Bug: 修复由于path导致的无法清除cookie的问题
					 */
					$.removeCookie("userSession", {
						path: '/'
					});
					window.location.href = homepage;
					break;
				case 'CAPTCHA':
					throw "对不起，您请求过于频繁，请输入验证码后再试";
					break;
				case 'Not Logged In':
					$.removeCookie("userSession", {
						path: '/'
					});
					window.location.href = homepage;
					break;
				case 'Permission Denied':
					throw "Permission Denied";
					break;
				case 'Inconsistent Arguments':
					// Bug Track
					throw "Inconsistent Arguments";
					break;
			}
		};
		return Q($.ajax(data)).then(function(data) {
			return handle(data);
		}, function(error) {
			seajs.log(error);
			throw "Web Service Error";
		});
	};
});