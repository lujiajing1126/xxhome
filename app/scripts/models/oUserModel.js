define(function(require, exports, module) {
	var $ = SUI.$,
		//mConst = require('scripts/public/constants').appConst,
		Q = require('sui/async/q'),
		UserService = require('scripts/services/oUserService'),
		Helper = require('scripts/public/helper');
	require('sui/core/cookie');
	var isLocalStorage = window.localStorage ? true : false;
	User = (function() {
		/**
		 * 私有变量
		 */
		var session = null;
		return function() {
			this.id = null;
			this.name = null;
			this.isLogin = false;
			this.org = null;
			this.orgs = [];
			this.setSession = function(iSession) {
				session = iSession;
				$.cookie("userSession", iSession, {
					path: "/"
				});
				if (isLocalStorage) {
					window.localStorage.setItem("userSession", iSession);
				}
			};
			/**
			 * fix 手动清除 '/' 下的userSession cookie
			 * @return {[type]} [description]
			 */
			this.clearSession = function() {
				session = null;
				$.removeCookie('userSession', {
					path: "/"
				});
				if (isLocalStorage) {
					window.localStorage.removeItem("userSession");
				}
			};
			this.getSession = function() {
				return session;
			};
		};
	})();
	/**
	 * init UserModel get Session from localStorage or cookie
	 */
	User.prototype.init = function(fn) {
		var user = this,
			session = isLocalStorage ? (window.localStorage.getItem("userSession") || $.cookie("userSession")) : $.cookie("userSession");
		if (session) {
			user.isUserLogin(session, fn);
		} else {
			(Helper.getSession().then(function(session) {
				user.isUserLogin(session, fn);
			}))["catch"](function(error) {
				alert(error);
			}).done();
		}

	};
	/**
	 * [auth description]
	 * @return {[type]}
	 */
	User.prototype.auth = function(fn) {
		var session = this.getSession();
		if (!session)
			window.location.href = "/index.html";
		this.getLoginStatus(session, fn);
	}
	/**
	 * request server side for authenticate
	 * @param {object} data
	 */
	User.prototype.login = function(data) {
		var session = data.session,
			user = this;
		/**
		 *  send OPTIONS to validate Access-Control-Allow-Headers
		 *  Access-Control-Allow-Headers:reqid, nid, host, x-real-ip, x-forwarded-ip, event-type, event-id, accept, content-type, x-requested-with
		 *  Access-Control-Allow-Methods:GET, POST, OPTIONS
		 *  Access-Control-Allow-Origin:*
		 *  Access-Control-Max-Age:86400
		 */
		var DEBUG = Helper.getParam("dev");
		var url = DEBUG ? '/api/account/login' : 'https://xiaoxiao.la/api/account/login';
		return Q($.ajax({
			url: url,
			type: 'POST',
			dataType: 'JSON',
			data: data,
			crossDomain: false
		})).then(function(data) {
			if (data.status == "OK") {
				user.id = data.userId;
				user.isLogin = true;
				Helper.userStatus();
				return session;
			} else if (data.status == "Error")
				throw data.message;
			else
				throw data.status;
		}, function(error) {
			throw "╮(╯▽╰)╭服务器君挂了，请稍后再试!";
		});
	};
	User.prototype.loginOnly = function(data) {
		var session = data.session,
			user = this;
		var DEBUG = Helper.getParam("dev");
		var url = DEBUG ? '/api/account/login' : 'https://xiaoxiao.la/api/account/login';
		return Q($.ajax({
			url: url,
			type: 'POST',
			dataType: 'JSON',
			data: data,
			crossDomain: false
		})).then(function(data) {
			if (data.status == "OK") {
				user.id = data.userId;
				user.isLogin = true;
				return session;
			} else if (data.status == "Error")
				throw data.message;
			else
				throw data.status;
		}, function(error) {
			throw "╮(╯▽╰)╭服务器君挂了，请稍后再试!";
		});
	};

	// 根据Session取得用户登录状态
	User.prototype.getLoginStatus = function(session, fn) {
		var user = this;
		Helper.globalResponseHandler({
			url: "/api/account/id?session=" + session,
			dataType: 'JSON'
		}).then(function(data) {
			if (data && data.userId) {
				user.id = data.userId;
				return session;
			} else {
				$.goHome("登陆失效！");
			}
		}).then(function(session) {
			user.getUserInfo(session, fn);
		});
	};
	/**
	 * [isUserLogin 首页判断用户登录状态]
	 * @param  {[type]}   session [description]
	 * @param  {Function} fn      [description]
	 * @return {Boolean}          [description]
	 */
	User.prototype.isUserLogin = function(session, fn) {
		if (!session) return;
		var user = this;
		user.isLogin = false;
		user.setSession(session);
		Helper.globalResponseHandler({
			url: "/api/account/id?session=" + session,
			dataType: 'JSON'
		}).then(function(data) {
			if (data && data.userId) {
				user.setSession(session);
				user.id = data.userId;
				user.isLogin = true;
				//userNavigation(session);
			} else if (data == "Not Logged In") {
				//session有效，但未登录
			} else {
				user.clearSession();
				window.location.reload();
			}
		}).done(function() {
			fn && $.isFunction(fn) && fn(session);
		});
	};
	// 根据session取得用户账户信息
	User.prototype.getUserInfo = function(session, fn) {
		var user = this,
			userId = user.id;
		UserService.getOwnerUserInfo(userId, session).then(function(data) {
			$.each(["userInfo", "studentInfo", "extendedUserInfo"], function(idx, item) {
				user[item] = {};
				if (data[item]) {
					$.each(data[item], function(k, v) {
						user[item][k] = v;
					});
				}
			});
		}, function(error) {
			//console.log(error);
		}).then(function() {
			return $.ajax({
				url: '/api/account/list_administrated_organizations?session=' + session,
				type: 'GET',
				dataType: 'JSON'
			});
		}).then(function(data) {
				user.orgs = [];
				user.org = null;

				if (!data.organizations || data.organizations.length == 0) {
					$.goHome('您暂无可管理的组织，请在首页新建组织');
				} else {
					user.orgs = data.organizations;
				}

				//在缓存中查找默认的操作组织
				var currentOrganization = $.cookie("currentOrganization");
				$.each(data.organizations, function(idx, item) {
					if (currentOrganization && item.id == currentOrganization) {
						user.org = item;
					}
				});

				if (!user.org) {
					user.org = data.org || user.orgs[0];
				}
			},
			function(error) {
				seajs.log(error);
			}).done(function() {
			fn && $.isFunction(fn) && fn();
		});


	};
	User.prototype.switchOrganization = function(orgId) {
		//
		var user = this,
			orgs = user.orgs,
			has = false;
		$.each(orgs, function(idx, item) {
			if (item.id == orgId) {
				has = true;
				$.cookie("currentOrganization", orgId, {
					path: '/'
				});
				window.location.reload();
				return;
			}
		});
		if (!has)
			alert("组织不存在！");

	};
	//登出
	User.prototype.logout = function() {
		var user = this;
		Helper.globalResponseHandler({
			url: '/api/account/logout',
			type: 'POST',
			data: {
				session: this.getSession()
			},
			dataType: 'JSON'
		}).then(function(data) {
			//console.log(data);
		}, function(reason) {
			//console.log(reason);
		}).done(function() {
			user.clearSession();
			window.location.reload();
		});
	};
	User.prototype._login = function(data) {
		this.id = data.id;
		this.name = data.name;
		this.org = data.org;
	}
	module.exports = User;
});