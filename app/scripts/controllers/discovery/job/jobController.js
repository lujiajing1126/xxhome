define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		UserModel = require('scripts/models/oUserModel'),
		JobService = require('scripts/services/discovery/JobService'),
		Helper = require('scripts/public/helper'),
		moment = require('scripts/lib/moment'),
		browser = require('scripts/public/browser'),
		b = browser.browser;

	var session = Helper.getParam("session"),
		jobId = Helper.getParam("jid"), //通过app端查看招聘需要传session
		fromApp = Helper.getParam('fromapp');

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
		var _controller = this;
		_controller.namespace = "discoveryJob";
		_controller.actions = {
			share: function() {
				var url = Helper.pages.sJob + "?jid=" + jobId;
				Helper.appApi.share({
					url: url,
					fromApp: fromApp,
					fnc: function() {
						$(".share-container").removeClass("hide").find('.bds_more').get(0).click();
					}
				});
			}
		};
	};
	bC.extend(Controller);
	Controller.prototype.init = function() {
		var _controller = this;
		/**
		 * 初始化用户
		 * 获取招聘信息
		 * 渲染模板
		 */
		window.AppUser = new UserModel();
		AppUser.init(function() {
			var session = AppUser.getSession();
			(JobService.getJob(jobId, session).then(function(data) {
				if (data && data.status == "OK") {
					if (data.recruitment.stage == "drafting") {
						Helper.errorToast("招聘不存在");
						window.location.href = "/discovery/jobs";
					} else if (data.recruitment.stage == "archived") {
						Helper.errorToast("招聘已过期");
						window.location.href = "/discovery/jobs";
					} else {
						data.recruitment.descriptions = data.recruitment.description ? data.recruitment.description.split(/\r\n/g) : ["无职位介绍"];
						data.recruitment.application = moment(data.recruitment.application).format('MM-DD');
						data.share = true;
						data.fromApp = fromApp;
						$(".body").html(template("app/templates/discovery/job/job", data));
					}
				} else throw data;
			}))["catch"](function(error) {
				if (error == "Not Logged In") {
					Helper.alert("请先登录！", {}, function() {
						window.location.href = Helper.pages.login + "?go=job|" + jobId;
					});
				} else {
					Helper.errorToast(error);
				}
			}).done(function() {
				Helper.userStatus();
			});
		});
		Helper.eventListener("click", _controller.actions);
	};
	module.exports = Controller;
});