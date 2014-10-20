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
		this.actions = {
			loadMore: function(e) {
				var that = this;
				Helper.btnLoadingStart(that, "正在加载...");
				pageIndex++;
				render(false);
			}
		};
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
			// var session = AppUser.getSession();
			// (UserService.getSubscriptions(session).then(function(data) {
			// 	if (data && data.status == "OK") {
			// 		/**
			// 		 * 先获取学校版块
			// 		 * 然后根据版块获取招聘列表
			// 		 */
			// 		$.each(data.subscriptions, function(idx, item) {
			// 			subscriptions.push(item.boardName);
			// 		});
			// 		render(true);
			// 	} else {
			// 		throw data;
			// 	}
			// }))["catch"](function(error) {
			// 	if (error == "Not Logged In") {
			// 		Helper.alert("请先登录！", {}, function() {
			// 			window.location.href =Helper.pages.login+"?go=jobs";
			// 		});
			// 	} else {
			// 		Helper.errorToast(error);
			// 	}
			// }).done(function() {
			// 	Helper.userStatus();
			// });
			render(true);
		});
		Helper.eventListener("click", _controller.actions);
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
			var action = init ? "html" : "append";
			$.each(data.recruitments, function(idx, item) {
				item.application = moment(item.application).format('MM-DD');
			});
			//判断是否全部加载
			data.fullyLoaded = (pageIndex * limit + data.recruitments.length) >= data.numberOfRows;
			$(".body .load-more-wrapper").remove();
			$(".body")[action](template("app/templates/discovery/job/jobs", data));
		}))["catch"](function(error) {
			Helper.errorToast(error);
			/**
			 * 加载失败且加载事件来自“加载更多”按钮，则需要处理该按钮
			 */
			if (!init) {
				pageIndex--;
				Helper.btnLoadingEnd($(".load-more-wrapper .btn"), "加载失败");
			}
		}).done(function(){
			Helper.userStatus();
		});
	};

	module.exports = Controller;
});