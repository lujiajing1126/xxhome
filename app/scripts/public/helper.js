define(function(require, exports, module) {
	var Q = require('sui/async/q'),
		sysConfig = require('scripts/public/msysconfig'),
		eventListener = require('scripts/public/eventListener'),
		Alert = require('scripts/lib/Ly.alert'),
		Toast = require('scripts/lib/Ly.toast'),
		jumpRouter = require('scripts/public/jumpRouter'),
		expPhoneNumber = sysConfig.regulars.phoneNumber,
		expEmail = sysConfig.regulars.email,
		expPassword = sysConfig.regulars.password,
		expAuthCode = sysConfig.regulars.authCode;

	exports.tips = sysConfig.tips;
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
					// $.removeCookie("userSession", {
					// 	path: '/'
					// });
					// if ($("#BTN_LOGIN").length > 0) {
					// 	$("#BTN_LOGIN").trigger("click");
					// } else {
					// 	window.location.href = homepage;
					// }
					return data.status;
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
		return globalResponseHandler({
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
	/**
	 * get params of the uri
	 */
	exports.getParam = function(param) {
		param = param || null;
		if (param) {
			var tmpReg = new RegExp("[\\?\\&]" + param + "=([\\w\\d-|]*)"),
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

	/**
	 * make sure of the user status
	 */
	exports.userStatus = function() {
		var html,
			session = AppUser.getSession(),
			isLogin = AppUser.isLogin;
		if (!isLogin) {
			return;
		}
		$.ajax({
			url: '/api/account/list_administrated_organizations?session=' + session,
			dataType: 'json',
			success: function(data) {
				if (data.status == "OK") {
					if (data.organizations && data.organizations.length > 0) {
						html = "<a href='/home.html#index' target='_blank'><span>组织管理</span></a> <i></i><a href='javascript:void(0);' data-xx-login-action='Logout'>退出</a>";
					} else {
						html = "<a href='javascript:void(0);' data-xx-login-action='createOrganization'><span class='org-add'>+创建组织</span></a> <i></i><a href='javascript:void(0);' data-xx-login-action='Logout'>退出</a>";
					}
					$("#userBox").html(html);
				} else {
					throw data;
				}
			},
			error: function(error) {
				alert("组织信息获取失败！");
			}
		});
	};


	/**
	 * disable 掉提交中的按钮
	 * @param  {jquery obj} btn         	按钮的jquery对象
	 * @param  {string} loadingText 	loading状态中按钮文字
	 */
	exports.btnLoadingStart = function(btn, loadingText) {
		var oText = btn.text();
		btn.data("data-text", oText);
		loadingText = loadingText || '处理中...';
		btn.text(loadingText).siblings('.btn').addBack().attr('disabled', 'disabled');
	};
	exports.btnLoadingEnd = function(btn, text) {
		text = text || btn.data("data-text") || "确定";
		btn.text(text).siblings('.btn').addBack().removeAttr('disabled');
	};
	/**
	 * 取消event默认事件
	 */
	exports.preventDefault = function(event) {
		if (event.preventDefault)
			event.preventDefault();
		else
			event.returnValue = false;
	};

	/**
	 * 验证用户名的有效性，用户名必须为手机号码或邮箱
	 */
	exports.validateUserName = function(userName) {
		var result = false;
		if (expPhoneNumber.test(userName) || expEmail.test(userName)) {
			result = true;
		}
		return result;
	};
	exports.isEmail = function(value) {
		return expEmail.test(value);
	};
	exports.isPhoneNumber = function(value) {
		return expPhoneNumber.test(value);
	};
	exports.isPassword = function(value) {
		return expPassword.test(value);
	};
	exports.isAuthCode = function(value) {
		return expAuthCode.test(value);
	};
	exports.tips = sysConfig.tips;
	exports.pages = sysConfig.pages;

	exports.eventListener = eventListener.eventListener;

	/**
	 * 弹出框插件
	 */
	exports.alert = function(message, options, callback) {
		options = $.extend({}, options);
		Alert.alert(message, options, callback);
	};

	/**
	 * 提示组
	 */
	exports.successToast = function(message) {
		Toast.toast(message, {
			theme: 'success'
		});
	};
	exports.errorToast = function(message) {
		Toast.toast(message, {
			theme: 'danger'
		});
	};
	exports.errorCenterToast = function(message) {
		Toast.toast(message, {
			theme: 'danger',
			position: 'center'
		});
	};
	/**
	 * 全局错误处理函数
	 */
	exports.errorHandler = function(message) {
		Toast.toast(message, {
			theme: 'danger'
		});
	};
	exports.jumpRouter = jumpRouter;
});