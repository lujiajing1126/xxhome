define(function(require, exports, module) {
	require("scripts/public/helpers");
	var $ = SUI.$,
		Q = require("sui/async/q"),
		userModel = require("scripts/models/UserModel"),
		delay = 3000,
		loginErrorHandler = function(msg) {
			var tip = $("#Login_Box_Wrapper").find(".tip");
			tip.addClass("on").children("span").text(msg);
			setTimeout(function() {
				tip.removeClass("on").children("span").text('');
			}, delay);
		},
		signupEmailErrorHandler = function(msg) {
			var tip = $("#Signup_Box_Wrapper").find("#Signup_Tip2");
			tip.addClass("on").children("span").text(msg);
			setTimeout(function() {
				tip.removeClass("on").children("span").text('');
			}, delay);
		},
		signupPhoneErrorHandler = function(msg) {
			var tip = $("#Signup_Box_Wrapper").find("#Signup_Tip");
			tip.addClass("on").children("span").text(msg);
			setTimeout(function() {
				tip.removeClass("on").children("span").text('');
			}, delay);
		},
		userStatus = function(login) {
			if (!login) {
				AppUser.clearSession();
			};
			var html = login ? '<a href="/home.html#index"><span>组织管理</span></a>' : '<span id="BTN_LOGIN" data-xx-login-action="loginBox">登陆</span> <i></i><span id="BTN_SIGNUP" data-xx-login-action="signupBox">注册</span>';
			$("#userBox").html(html);
		};


	// 初始化用户，全局唯一的用户示例
	window.AppUser = new userModel();
	var session = $.cookie("userSession");
	if (session) {
		AppUser.isUserLogin(session, userStatus);
	}

	var O = {
		actions: {
			// create login box
			loginBox: function() {
				var box = $("#Login_Box_Wrapper");
				if (box.length > 0) {
					box.addClass("on");
				} else {
					var html = "<div id='Login_Box_Wrapper' class='login-box on' data-xx-login-action=''>" + "<div id='Login_Box' class='box'>" + "<header class='bg'>" + "<div class='close' title='关闭' data-xx-login-action='closeLoginBox'>" + "<span>×</span>" + "</div>" + "</header>" + "<section class='form-box'>" + "<div class='form'>" + "<div class='form-row'>" + "<div class='tip' id='Login_Tip'>" + "<span></span>" + "</div>" + "</div>" + "<div class='form-row'>" + "<span>账号</span>" + "<input type='text' name='u' placeholder='邮箱/手机号' title='账号为邮箱或者手机号！' id='USERNAME'  />" + "</div>" + "<div class='form-row'>" + "<span>密码</span>" + "<input type='password' name='u' placeholder='密码' id='PASSWORD'  />" + "</div>" + "<div class='form-row'>" + "<input type='submit' value='登陆' id='BOX_BTN_SIGNIN' data-xx-login-action='login' />" + "</div>" + "<div class='form-row'>" + "<div class='login-help'>" + "<a href='javascript:void(0);' data-xx-login-action='signupBox'>立即注册</a> <i></i>" + "<a href='javascript:void(0);'>忘记密码？</a>" + "</div>" + "</div>" + "</div>" + "</section>" + "</div>" + "</div>";
					$(html).appendTo("body");
				}
				$(document).on("keydown.loginBox", function(e) {
					e = e || window.event;
					if (e.keyCode == 27) //escape
						O.actions.closeLoginBox();
					if (e.keyCode == 13) { //enter
						$('#BOX_BTN_SIGNIN').trigger("click");
					}
				});
			},
			// create signup box
			signupBox: function() {
				$(".login-box.on").removeClass("on");
				var box = $("#Signup_Box_Wrapper");
				if (box.length > 0) {
					box.addClass("on");
				} else {
					html = '<div id="Signup_Box_Wrapper" class="login-box on" data-xx-login-action=""><div class="box for-phone" id="Signup_Box"><header class="bg"><div class="close" title="关闭" data-xx-login-action="closeSignupBox"><span>×</span></div><div><button class="for-phone" data-xx-login-action="changeModule">手机注册</button><button class="for-email" data-xx-login-action="changeModule">邮箱注册</button></div></header><section class="form-box"><div  class="form for-phone"><div class="form-row"><div class="tip" id="Signup_Tip"><span>邮箱不能为空！</span></div></div><div class="form-row"><span>手机号码</span><input type="text" name="phone"  placeholder="输入您的手机号码" id="PHONENUM" /></div><div class="form-row btn-wrapper"><span>验证码</span><input type="text" name="authcode"  placeholder="输入手机收到的验证码" id="AUTHCODE" /><span id="authButton" class="btn-side"  data-xx-login-action="getAuthCode">获取验证码</span></div><div class="form-row"><span>输入密码</span><input type="password" name="psw"  placeholder="输入密码" id="P_PWD" /></div><div class="form-row"><span>确认密码</span><input type="password" name="repsw"  placeholder="再次输入密码" id="P_REPWD" /></div><div class="form-row"><input type="submit" id="P_Submit" value="注册" data-xx-login-action="signup_phone" /></div></div><div class="form for-email"><div class="form-row"><div class="tip" id="Signup_Tip2"><span>邮箱不能为空！</span></div></div><div class="form-row"><span>邮箱地址</span><input type="text" name="phone"  placeholder="输入您的邮箱地址" id="EMAIL" /></div><div class="form-row"><span>输入密码</span><input type="password" name="psw"  placeholder="输入密码" id="E_PWD" /></div><div class="form-row"><span>确认密码</span><input type="password" name="repsw"  placeholder="再次输入密码" id="E_REPWD" /></div><div class="form-row"><input type="submit" id="E_Submit" value="注册并验证邮箱" data-xx-login-action="signup_email" /></div></div></section></div></div>';
					$(html).appendTo("body");
					$(document).on("keyup", "#PHONENUM", function() {
						showAuthButton(this);
					});
				}
				$(document).on("keydown.loginBox", function(e) {
					e = e || window.event;
					if (e.keyCode == 27)
						O.actions.closeSignupBox();
				});

			},
			// close login & signup box
			close: function(boxId) {
				$("#" + boxId).removeClass("on");
				$(document).off(".loginBox");
			},
			closeLoginBox: function() {
				O.actions.close("Login_Box_Wrapper");
			},
			closeSignupBox: function() {
				O.actions.close("Signup_Box_Wrapper");
			},
			// login event
			login: function(event) {
				var btn = this,
					password = $("#PASSWORD").val(),
					username = $("#USERNAME").val();
				event = event || window.event;
				event.preventDefault();
				if (VALIDATE()) {
					if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(username)) {
						var usernameType = {
							email: username
						};
					} else {
						var usernameType = {
							phone_number: username
						};
					}
					$(btn).attr("disabled", "disabled").val("正在登陆...");
					$.getSession()
						.then(function(session) {
							// user = new userModel();
							return AppUser.login($.extend({
								session: session,
								password: password
							}, usernameType));
						}, function(error) {
							return error;
						}).then(function(session) {
							console.log(session);
							$("#Login_Box_Wrapper").removeClass("on");
							var html = "<a href='/home.html#index'><span>组织管理</span></a>";
							$("#userBox").html(html);
							//window.location.href = "/home.html#index";
						}).catch(function(error) {
							loginErrorHandler(error);
						}).done(function() {
							$(btn).removeAttr("disabled").val("登陆");
						});
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
					$.getSession().then(function(session) {
						return Q($.ajax({
							url: '/api/account/register',
							type: 'post',
							dataType: 'json',
							data: {
								session: session,
								phone_number: phoneNumber,
								phone_number_verification_code: authcode,
								password: password
							}
						})).then(function(data) {
							if (data.status == "OK")
								return "注册成功";
							else
								throw "注册失败";
						}, function() {
							throw "╮(╯▽╰)╭服务器君出错了";
						});
					}).then(function(data) {
						alert(data);
						O.actions.closeSignupBox();
					}, function(reason) {
						alert(reason);
					}).done(function() {
						$(btn).removeAttr("disabled").val("注册");
					});
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
					$.getSession().then(function(session) {
						return Q($.ajax({
							url: '/api/account/register',
							type: 'post',
							dataType: 'json',
							data: {
								session: session,
								email: email,
								password: psw
							}
						})).then(function(data) {
							if (data.status == "OK")
								return "注册成功";
							else
								throw "注册失败";
						}, function() {
							throw "╮(╯▽╰)╭服务器君出错了";
						});
					}).then(function(data) {
						alert(data);
						O.actions.closeSignupBox();
					}, function(reason) {
						alert(reason);
					}).done(function() {
						$(btn).removeAttr("disabled").val("注册");
					});
				}
				return false;
			},
			changeModule: function() {
				var btnClass = this.className;
				$(this).parents("#Signup_Box").attr({
					"class": "box " + btnClass
				});
			},
			getAuthCode: function() {
				var _this = this,
					phoneNumber = $("input#PHONENUM").val();
				if (/(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/.test($.trim(phoneNumber))) {
					if (!$(this).hasClass("disabled")) {
						$(_this).addClass("disabled");
						var time = 6;
						var waiting = function() {
							$(_this).text(time--+"秒之后重试");
							if (time == 0) {
								$(_this).removeClass("disabled").text("重新发送");
								return;
							}
							setTimeout(function() {
								waiting();
							}, 1000);
						};
						waiting();
					}
					$.getSession().then(function(session) {
						return Q($.ajax({
							url: '/api/account/send_verification_request_to_phone_number',
							type: "POST",
							dataType: "JSON",
							data: {
								phone_number: phoneNumber,
								session: session
							}
						}));
					}).then(function(data) {
						console.log(data.status);
					}).done();
					return false;
				} else {
					signupPhoneErrorHandler('手机号码不能为空!');
					return false;
				}
			}
		}
	};

	$(document).on("click", "[data-xx-login-action]", function(ev) {
		var fn = $(this).attr("data-xx-login-action");
		$.isFunction(O.actions[fn]) && O.actions[fn].call(this, ev);
	});

	// 根据用户输入判断是否显示验证码发送按钮
	var showAuthButton = function(obj) {
		var phone = $(obj).val();
		if (/(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/.test($.trim(phone))) {
			$("#authButton").addClass("on");
		} else
			$("#authButton").removeClass("on");
	}

	function VALIDATE() {
		var msg = "";
		var un = $("#USERNAME").val(),
			pwd = $("#PASSWORD").val();
		var reEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //email
		var rePhone = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/; //phone number

		if (!reEmail.test(un) && !rePhone.test(un)) {
			msg = "账号格式为邮箱或手机号！";
		} else if (pwd == "") {
			msg = "密码不能为空！";
		}
		if (msg != "") {
			loginErrorHandler(msg);
			return false;
		}
		return true;
	}
	//验证
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
		if (msg != "") {
			signupEmailErrorHandler(msg);
			return false;
		}
		return true;
	}

	module.exports = O;
});