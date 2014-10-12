define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		UserModel = require('scripts/models/oUserModel'),
		UserService = require('scripts/services/oUserService'),
		JobService = require('scripts/services/discovery/JobService'),
		moment = require('scripts/lib/moment'),
		Helper = require('scripts/public/helper'),
		bowser = require('scripts/public/bowser'),
		b = bowser.bowser;

	var pageIndex = 0,
		limit = 10,
		subscriptions = [], //用户订阅的学校版块
		session = Helper.getParam("session"), //通过app端查看招聘需要传session
		keyword = Helper.getParam("keyword");
	/**
	 * 如果app端已传session，则手动设置session
	 */
	if (session) {
		var isLocalStorage = window.localStorage ? true : false;
		$.cookie("userSession", session, {
			path: "/"
		});
		if (isLocalStorage)
			window.localStorage.setItem("userSession", session);
	}

	var Controller = function() {
		this.namespace = "discoveryJobs";
	};
	bC.extend(Controller);
	Controller.prototype.init = function() {
		var _controller = this;
		/**
		 * 初始化用户
		 * 获取用户订阅的学校列表
		 * 获取学校的招聘列表
		 */
		window.AppUser = new UserModel();
		AppUser.init(function() {
			var session = AppUser.getSession();
			(UserService.getSubscriptions(session).then(function(data) {
				if (data && data.status == "OK") {
					$.each(data.subscriptions, function(idx, item) {
						subscriptions.push(item.boardName);
					});
					/**
					 * 获取学校版块之后获取招聘列表
					 */
					render();
					//$(".body").html(template("app/templates/discovery/job/jobs", {}));
				} else {
					throw data;
				}
			}))["catch"](function(error) {
				Helper.errorToast(error);
			}).done(function() {
				Helper.userStatus();
			});

		});
	};
	/**
	 * 取数据并渲染模板
	 * init：指定是否为初始化页面
	 * 如果init为true，则替换body中的dom
	 * 如果init为false，则往body中添加dom
	 */
	function render(init) {
		var session = AppUser.getSession();
		(JobService.getJobs(subscriptions, session, pageIndex * limit, limit).then(function(data) {
			console.log(data);
			if (init)
				$(".body").html(template("app/templates/discovery/jobs", data));
			else
				$(".body").append(template("app/templates/discovery/jobs", data));
		}))["catch"](function(error) {
			Helper.errorToast(error);
		});
	};

	module.exports = Controller;
});