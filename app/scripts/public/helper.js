define(function(require, exports, module) {
	var Q = require('sui/async/q'),
		expPhoneNumber = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/,
		expEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

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
	var globalResponseHandler = function(data, options) {
		var handle = function(data) {
			var homepage = "/index.html";
			switch (data.status) {
				case 'OK':
					return data;
					break;
				case 'Error':
					throw data.message;
					break;
				case 'Expired':
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
	exports.globalResponseHandler = globalResponseHandler;
	/**
	 * 获取Session，常用于没有Session存在的情况，如登陆，注册
	 * @return {Q Promise}
	 */
	var getSession = function() {
		$.removeCookie('userSession');
		return $.globalResponseHandler({
			url: "/api/session/create",
			type: "POST",
			dataType: "JSON"
		}).then(function(data) {
			seajs.log(data);
			if (data.status == "OK")
				return data.session;
			else
				throw "session create failed";
		}, function(error) {
			throw "session create failed";
		});
	};
	exports.getSession = getSession;
	/**
	 * 不能确定是否登录的情况下请求服务器统一函数入口
	 * @param  {Function} 		successFnc [session验证成功执行的函数]
	 * @param  {[Function]} 	errorFnc   [session验证失败执行的函数]
	 */
	exports.requestWithSession = function(successFnc, errorFnc) {
		var session = $.cookie("userSession");
		//if session is existed then auth it
		//or create a new session without login
		if (session) {
			(globalResponseHandler({
				url: "/api/account/id?session=" + session,
				type: "GET",
				dataType: 'JSON'
			}).then(function(data) {
				if (data.status == "OK") {
					successFnc && $.isFunction(successFnc) && successFnc(session);
				}
			})["catch"])(function() {
				authFail();
			});
		} else {
			authFail();
		}
		// if session auth failed then do this
		function authFail() {
			(getSession().then(function(session) {
				successFnc && $.isFunction(successFnc) && successFnc(session);
			})["catch"])(function(error) {
				errorFnc && $.isFunction(errorFnc) && errorFnc(error);
			}).done();
		}
	};

	exports.getParam = function(param) {
		param = param || null;
		if (param) {
			var tmpReg = new RegExp("[\\?\\&]" + param + "=([\\w\\d]*)"),
				result = window.location.href.match(tmpReg);
			return result ? result[1] : null;
		} else {
			var result = window.location.href.match(/\?(.*)/) || null;
			if (result) {
				return result[1].split("&");
			} else {
				return {};
			}
		}
	};

	exports.validateUserName = function() {};
	//exports.goHome
});