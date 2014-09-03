define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		Helper = require('scripts/public/helper');

	var Controller = function(eventId) {
		this.namespace = "password";
		this.actions = {
			//忘记密码
			getPassword: function(event) {
				event.preventDefault();
				var userName = $.trim($("#userName").val());
				if (Helper.validateUserName(userName)) {
					//ajax请求后台发送短信或邮箱
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
				}else if(newPassword.length<3||newPassword.length>12){
					msg="密码长度必须为3-12位";
				} else if (oldPassword == newPassword) {
					msg = "新密码不能与旧密码一样";
				}
				if (msg) {
					alert(msg);
					return;
				}

				Helper.requestWithSession(success, error);

				function success(session) {
					Helper.globalResponseHandler({
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
					}).catch(function(error) {
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

	};

	function validate() {

	}


	module.exports = Controller;
});