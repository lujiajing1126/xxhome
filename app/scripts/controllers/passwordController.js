define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		Helper = require('scripts/public/helper'),
		UserService = require('scripts/services/oUserService');

	var Controller = function(eventId) {
		this.namespace = "password";
		this.actions = {
			//获取验证码
			getAuthCode: function(event) {
				event.preventDefault();
				var btn_auth_code = this;
				var userName = $.trim($("#userName").val());
				if (Helper.validateUserName(userName)) {
					var btnMessage, session = AppUser.getSession();
					if (Helper.isEmail(userName)) {
						btnMessage = "邮箱验证码已在路上...";
					}
					if (Helper.isPhoneNumber(userName)) {
						btnMessage = "短信验证码已在路上...";
					}
					btn_auth_code.attr("disabled", "disabled").text(btnMessage);

					if (session) {
						getAuthCode(userName, session, btn_auth_code);
					} else {
						window.location.reload();
					}
				} else {
					alert("无效的用户名");
				}
			},
			//重置密码
			resetPassword: function() {
				event.preventDefault();
				var userName = $.trim($("#userName").val()),
					authCode = $("#authCode").val(),
					newPassword = $("#newPassword").val(),
					session = AppUser.getSession();
				if (Helper.validateUserName(userName)) {
					(UserService.resetPassword(userName, authCode, newPassword, session).then(function(data) {
						if (data && data.status == "OK") {
							alert("密码修改成功");
						}
					}))["catch"](function(error) {
						alert(error);
					}).done();
				} else {
					alert("无效的用户名");
				}
			},
			//修改密码
			changePassword: function(event) {
				event.preventDefault();
				var userName = $.trim($("#userName").val()),
					oldPassword = $("#oldPassword").val(),
					newPassword = $("#newPassword").val(),
					confirmPassword = $("#confirmPassword").val();
				var msg = null;
				if (!Helper.validateUserName(userName)) {
					msg = "无效的用户名";
				} else if (oldPassword == "") {
					msg = "请填写旧密码";
				} else if (newPassword == "") {
					msg = "请填写新密码";
				} else if (confirmPassword == "") {
					msg = "请确认新密码";
				} else if (newPassword != confirmPassword) {
					msg = "两次新密码不一致";
				} else if (newPassword.length < 3 || newPassword.length > 12) {
					msg = "密码长度必须为3-12位";
				} else if (oldPassword == newPassword) {
					msg = "新密码不能与旧密码一样";
				}
				if (msg) {
					alert(msg);
					return;
				}

				Helper.requestWithSession(success, error);

				function success(session) {
					(Helper.globalResponseHandler({
						url: '/api/account/change_password',
						type: 'post',
						dtaType: 'json',
						data: {
							session: session,
							password: oldPassword,
							new_password: newPassword
						}
					}).then(function(data) {
						//console.log(d);
						if (data && data.status == "OK") {
							alert("修改成功");
						} else {
							throw data || "请求失败";
						}
					}))["catch"](function(error) {
						alert(error);
					}).done();
				}

				function error(msg) {
					alert(msg);
				}
			}
		};
	};
	bC.extend(Controller);
	Controller.prototype.init = function(templateName, data) {
		$(".body").append(template(templateName, data || {}));
		var _controller = this;
		$(document).on("click." + this.namespace, "[data-xx-action]", function(event) {
			var $this = $(this),
				$action = $this.attr("data-xx-action");
			event = event || window.event;
			_controller.actions && _controller.actions[$action] && $.isFunction(_controller.actions[$action]) && _controller.actions[$action].call($this, event);
		});
		$(document).on("keyup." + this.namespace, "#userName", function(event) {
			event = event || window.event;
			var userName = $(this).val();
			if (Helper.isEmail(userName) || Helper.isPhoneNumber(userName)) {
				$("#btn_auth_code").show();
			} else {
				$("#btn_auth_code").hide();
			}
		});
	};

	function getAuthCode(userName, session, btn_auth_code) {
		(UserService.getAuthCode(userName, session).then(function(data) {
			if (data && data.status == "OK") {
				btn_auth_code.text("验证码发送成功！");
			}
		}))["catch"](function(error) {
			btn_auth_code.removeAttr("disabled").text("验证码发送失败，请重试！");
		}).done();
	}


	module.exports = Controller;
});