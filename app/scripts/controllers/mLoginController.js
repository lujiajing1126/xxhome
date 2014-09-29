define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		userModel = require("scripts/models/oUserModel"),
		template = require('build/template'),
		Helper = require('scripts/public/helper');

	var go = Helper.getParam("go"),
		param = go;
	go && (go = Helper.jumpRouter(go));
	go = go || Helper.pages.home;

	var Controller = function() {
		var that = this;
		this.namespace = "login";
		this.actions = {
			login: function(event) {
				Helper.preventDefault(event);
				var login_btn = this,
					userName = login_btn.parents("form").find("#userName").val(),
					password = login_btn.parents("form").find("#password").val();
				if (!Helper.validateUserName(userName)) {
					Helper.errorCenterToast('用户名错误');
					return;
				}
				if (!Helper.isPassword(password)) {
					Helper.errorToast(Helper.tips.password);
					return;
				}

				var logindata = {
					session: AppUser.getSession(),
					password: password
				};
				if (Helper.isPhoneNumber(userName))
					logindata.phone_number = userName;
				else
					logindata.email = userName;
				Helper.btnLoadingStart(login_btn, Helper.tips.loginLoading);
				(AppUser.loginOnly(logindata).then(function(session) {
					session && go && (window.location.href = go);
				}))["catch"](function(error) {
					Helper.errorCenterToast(error);
					Helper.btnLoadingEnd(login_btn);
				});
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

		function render() {
			$('.body').html(template('app/templates/login', {
				go: "?go=" + param
			}));
		}
	};
	module.exports = Controller;
});