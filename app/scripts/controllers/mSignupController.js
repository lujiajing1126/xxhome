define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		userModel = require("scripts/models/oUserModel"),
		template = require('build/template'),
		Helper = require('scripts/public/helper');

	var go = Helper.getParam("go"),
		param = go || "";
	go && (go = Helper.jumpRouter(go));
	go = go || Helper.pages.home;

	var Controller = function() {
		var that = this;
		this.namespace = "signup";
		this.actions = {
			authUserNameType: function() {
				var ipt_userName = this,
					userName = ipt_userName.val();
				if (Helper.isPhoneNumber(userName))
					$(".phone-only").removeClass("off");
				else
					$(".phone-only").addClass("off");
			},
			authUserName: function() {
				var ipt_userName = this,
					userName = ipt_userName.val();
				if (!Helper.validateUserName(userName)) {
					Helper.errorCenterToast(Helper.tips.userName);
					ipt_userName.parents(".box-row").addClass("has-error");
				} else {
					ipt_userName.parents(".box-row").removeClass("has-error");
				}
			},
			getAuthCode: function(event) {
				Helper.preventDefault(event);
				var btn_authCode = this,
					ipt_userName = $("#userName"),
					userName = ipt_userName.val();
				if (!Helper.isPhoneNumber(userName)) {
					Helper.errorCenterToast("错误的手机号码！");
					return;
				}
				getAuthCode(userName, btn_authCode);
			},
			signup: function(event) {
				Helper.preventDefault(event);
				var signup_btn = this,
					userName = signup_btn.parents("form").find("#userName").val(),
					password = signup_btn.parents("form").find("#password").val();
				if (!Helper.validateUserName(userName)) {
					Helper.errorCenterToast('用户名必须为手机号或邮箱');
					return;
				}
				if (Helper.isPhoneNumber(userName)) {
					var authCode = signup_btn.parents("form").find("#authCode").val();
					if (!Helper.isAuthCode(authCode)) {
						Helper.errorCenterToast(Helper.tips.authCode);
						return;
					}
				}
				if (!Helper.isPassword(password)) {
					Helper.errorToast(Helper.tips.password);
					return;
				}

				var signupdata = {
					session: AppUser.getSession(),
					password: password
				};
				if (Helper.isPhoneNumber(userName)) {
					signupdata.phone_number = userName;
					signupdata.phone_number_verification_code = authCode;
				} else {
					signupdata.email = userName;
				}
				Helper.btnLoadingStart(signup_btn, Helper.tips.signuping);
				(Helper.globalResponseHandler({
					url: '/api/account/register',
					type: 'post',
					dataType: 'json',
					data: signupdata
				}).then(function(data) {
					if (data && data.status == "OK") {
						AppUser.setSession(signupdata.session);
						Helper.alert("注册成功", {}, function() {
							window.location.href = Helper.pages.login + '?go=' + param;
						});
					} else throw data;
				}))["catch"](function(error) {
					Helper.alert(error);
					Helper.btnLoadingEnd(signup_btn);
				}).done();
			}
		};
	};

	bC.extend(Controller);
	Controller.prototype.init = function() {
		var _controller = this;
		// 初始化用户，全局唯一的用户示例
		window.AppUser = new userModel();
		AppUser.init(render);
		Helper.eventListener("click." + _controller.namespace, _controller.actions);
		//Helper.globalEventListener("blur." + _controller.namespace, "data-xx-blur-action", _controller.actions);
		//Helper.globalEventListener("keyup." + _controller.namespace, "data-xx-keyup-action", _controller.actions);

		function render() {
			$('.body').html(template('app/templates/signup', {
				go: "?go=" + param
			}));
		}
	};

	function getAuthCode(userName, btn_authCode) {
		var session = AppUser.getSession();
		Helper.btnLoadingStart(btn_authCode, "正在发送...");
		Helper.requestBySession(session, sendAuthCode);

		function sendAuthCode(session) {
			(Helper.globalResponseHandler({
				url: '/api/account/send_verification_request_to_phone_number',
				type: 'post',
				dataType: 'json',
				data: {
					phone_number: userName,
					session: session
				}
			}).then(function(data) {
				if (data && data.status == "OK") {
					Helper.successToast("验证码发送成功");
					var delay = Helper.delays.authCode;
					var waiting = function() {
						btn_authCode.text("发送成功，" + (delay--) + "秒之后重试");
						if (delay == 0) {
							btn_authCode.removeAttr("disabled").text("重新发送");
							return;
						}
						setTimeout(function() {
							waiting();
						}, 1000);
					};
					waiting();
				} else throw data;
			}))["catch"](function(error) {
				Helper.alert(error);
				Helper.btnLoadingEnd(btn_authCode, "重新发送");
			}).done();
		}
	}
	module.exports = Controller;
});