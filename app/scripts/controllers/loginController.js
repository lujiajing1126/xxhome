define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		userModel = require("scripts/models/oUserModel"),
		template = require('build/template'),
		helper = require('scripts/public/helper'),
		OrganizationService = require('scripts/services/OrgService');

	var expPhoneNumber = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/,
		expEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		delay = 3000; //错误提示时间
	var Controller = function() {
		var that = this;
		this.namespace = "login";
		this.actions = {
			loginBox: function() {
				var box = $("#Login_Box_Wrapper");
				if (box.length > 0) {
					box.addClass("on");
				} else {
					$("body").append(template("app/templates/partial/login", {}));
				}
				$("#USERNAME").trigger("focus");
				$(document).on("keydown." + that.namespace, function(e) {
					e = e || window.event;
					if (e.keyCode == 27) //escape
						that.actions.closeLoginBox();
					if (e.keyCode == 13) { //enter
						$("#BOX_BTN_SIGNIN").trigger("click");
					}
				});
			},
			signupBox: function() {
				$(".login-box.on").removeClass("on");
				var box = $("#Signup_Box_Wrapper");
				if (box.length > 0) {
					box.addClass("on");
				} else {
					$("body").append(template("app/templates/partial/signup", {}));
					$(document).on("keyup." + that.namespace, "#PHONENUM", function() {
						showAuthButton(this);
					});
				}
				$("#PHONENUM:visible,#EMAIL:visible").trigger("focus");
				$(document).on("keydown." + that.namespace, function(e) {
					e = e || window.event;
					if (e.keyCode == 27)
						that.actions.closeSignupBox();
				});
			},
			closeLoginBox: function() {
				closeBox('Login_Box_Wrapper');
			},
			closeSignupBox: function() {
				closeBox('Signup_Box_Wrapper');
			},
			login: function(event) {
				var btn = this,
					password = $("#PASSWORD").val(),
					username = $("#USERNAME").val();
				event = event || window.event;
				event.preventDefault();
				if (login_validate()) {
					if (expEmail.test(username)) {
						var usernameType = {
							email: username
						};
					} else {
						var usernameType = {
							phone_number: username
						};
					}
					$(btn).attr("disabled", "disabled").val("正在登陆...");
					var session = AppUser.getSession();
					if (session) {
						(AppUser.login($.extend({
							session: session,
							password: password
						}, usernameType)).then(function(session) {
							$("#Login_Box_Wrapper").removeClass("on");
							//userNavigation(session);
						}))["catch"](function(error) {
							loginErrorHandler(error);
						}).done(function() {
							$(btn).removeAttr("disabled").val("登陆");
						});
					} else {
						window.location.reload();
					}
				}
			},
			changeModule: function() {
				var btnClass = this.className;
				$(this).parents("#Signup_Box").attr({
					"class": "box " + btnClass
				});
			},
			getAuthCode: function() {
				var $this = $(this),
					phoneNumber = $("input#PHONENUM").val();

				if (expPhoneNumber.test($.trim(phoneNumber))) {
					if (!$this.hasClass("disabled")) {
						$this.addClass("disabled");
						var time = 60;
						var waiting = function() {
							$this.text(time--+"秒之后重试");
							if (time == 0) {
								$this.removeClass("disabled").text("重新发送");
								return;
							}
							setTimeout(function() {
								waiting();
							}, 1000);
						};
						waiting();
					}
					var session = AppUser.getSession();
					(helper.globalResponseHandler({
						url: '/api/account/send_verification_request_to_phone_number',
						type: "POST",
						dataType: "JSON",
						data: {
							phone_number: phoneNumber,
							session: session
						}
					}).then(function(data) {
						if(data.status == "OK"){
							alert("验证码已经在路上了！");
						}
					}))["catch"](function(error) {
						signupPhoneErrorHandler(error);
					}).done();
					return false;
				} else {
					signupPhoneErrorHandler('手机号码不能为空!');
					return false;
				}
			},
			signup_phone: function(event) {
				var btn = this,
					event = event || window.event;
				event.preventDefault();
				if (validatePhone()) {
					$(btn).attr("disabled", "disabled").val("注册中...");
					var phoneNumber = $("input#PHONENUM").val(),
						authcode = $("#AUTHCODE").val(),
						password = $("#P_PWD").val();

					var session = AppUser.getSession();
					if (session) {
						(helper.globalResponseHandler({
							url: '/api/account/register',
							type: 'post',
							dataType: 'json',
							data: {
								session: session,
								phone_number: phoneNumber,
								phone_number_verification_code: authcode,
								password: password
							}
						}).then(function(data) {
							if (data.status == "OK") {
								that.actions.closeSignupBox();
								alert("注册成功");
							} else
								throw "注册失败";
						})["catch"])(function(error) {
							signupPhoneErrorHandler(error);
						}).done(function() {
							$(btn).removeAttr("disabled").val("注册");
						});
					} else {
						signupPhoneErrorHandler("session不存在");
						window.location.reload();
					}

				}

			},
			signup_email: function(event) {
				var btn = this,
					event = event || window.event;
				event.preventDefault();
				if (validateEmail()) {
					$(btn).attr("disabled", "disabled").val("注册中...");
					var email = $("#EMAIL").val(),
						psw = $("#E_PWD").val();

					var session = AppUser.getSession();
					if (session) {
						(helper.globalResponseHandler({
							url: '/api/account/register',
							type: 'post',
							dataType: 'json',
							data: {
								session: session,
								email: email,
								password: psw
							}
						}).then(function(data) {
							if (data.status == "OK") {
								alert("请求成功，请查收您的邮箱并验证！");
								that.actions.closeSignupBox();
							} else
								throw "注册失败";
						}))["catch"](function(error) {
							signupEmailErrorHandler(error);
						}).done(function() {
							$(btn).removeAttr("disabled").val("注册并验证邮箱");
						});
					} else {
						signupPhoneErrorHandler("session不存在");
						window.location.reload();
					}
				}
				return false;
			},
			Logout: function() {
				AppUser.logout();
			},
			createOrganization: function() {
				var session = AppUser.getSession();
				if (!session) {
					alert("请先登录！");
					return;
				}
				var orgName = prompt("请输入组织名称");
				if (orgName) {
					(OrganizationService.createOrganization(orgName, session).then(function(data) {
						if (data.status == "OK") {
							alert("组织创建成功，您可以进入组织管理系统！");
							window.location.reload();
						}
					}))["catch"](function(error) {
						alert(error);
					}).done();
				}
			}
		};
	};
	bC.extend(Controller);
	Controller.prototype.init = function(fnc) {
		var _controller = this;
		// 初始化用户，全局唯一的用户示例
		window.AppUser = new userModel();
		AppUser.init(fnc);

		$(document).on("click", "[data-xx-login-action]", function(ev) {
			var fn = $(this).attr("data-xx-login-action");
			_controller.actions[fn] && $.isFunction(_controller.actions[fn]) && _controller.actions[fn].call(this, ev);
		});
	};

	var closeBox = function(boxId) {
		$("#" + boxId).removeClass("on");
		$(document).off(".login");
	};
	// 根据用户输入判断是否显示验证码发送按钮
	var showAuthButton = function(obj) {
		var phone = $(obj).val();
		if (expPhoneNumber.test($.trim(phone))) {
			$("#authButton").addClass("on");
		} else
			$("#authButton").removeClass("on");
	}

	function login_validate() {
		var msg = "";
		var userName = $("#USERNAME").val(),
			password = $("#PASSWORD").val();

		if (!expEmail.test(userName) && !expPhoneNumber.test(userName)) {
			msg = "账号格式为邮箱或手机号！";
		} else if (password == "") {
			msg = "密码不能为空！";
		}
		if (msg != "") {
			loginErrorHandler(msg);
			return false;
		}
		return true;
	}
	// //验证
	function validatePhone() {
		var un = $("#PHONENUM").val(),
			acode = $("#AUTHCODE").val(),
			psw = $("#P_PWD").val(),
			repsw = $("#P_REPWD").val();
		var rePhone = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/; //phone number
		var reAcode = /[0-9]{6}/; //6位数字
		var msg = "";
		if (!rePhone.test(un))
			msg = "手机号码格式不对！";
		else if (!reAcode.test(acode))
			msg = "验证码格式为6位数字";
		else if (psw == "")
			msg = "密码不能为空！";
		else if (repsw != psw)
			msg = "两次密码不同！";
		else if (psw.length < 3 || psw.length > 12) {
			msg = "密码长度为3-12位";
		}
		if (msg != "") {
			signupPhoneErrorHandler(msg);
			return false;
		}
		return true;
	}

	function validateEmail() {
		var un = $("#EMAIL").val(),
			psw = $("#E_PWD").val(),
			repsw = $("#E_REPWD").val();
		var reEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //email
		var msg = "";
		if (!reEmail.test(un))
			msg = "邮箱格式不对！";
		else if (psw == "")
			msg = "密码不能为空！";
		else if (repsw != psw)
			msg = "两次密码不同！";
		else if (psw.length < 3 || psw.length > 12) {
			msg = "密码长度为3-12位";
		}
		if (msg != "") {
			signupEmailErrorHandler(msg);
			return false;
		}
		return true;
	}

	function loginErrorHandler(msg) {
		var tip = $("#Login_Box_Wrapper").find(".tip");
		tip.addClass("on").children("span").text(msg);
		setTimeout(function() {
			tip.removeClass("on").children("span").text('');
		}, delay);
	}

	function signupEmailErrorHandler(msg) {
		var tip = $("#Signup_Box_Wrapper").find("#Signup_Tip2");
		tip.addClass("on").children("span").text(msg);
		setTimeout(function() {
			tip.removeClass("on").children("span").text('');
		}, delay);
	}

	function signupPhoneErrorHandler(msg) {
		var tip = $("#Signup_Box_Wrapper").find("#Signup_Tip");
		tip.addClass("on").children("span").text(msg);
		setTimeout(function() {
			tip.removeClass("on").children("span").text('');
		}, delay);
	}

	module.exports = Controller;
});