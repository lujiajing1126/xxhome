define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		UserModel = require('scripts/models/oUserModel'),
		JobService = require('scripts/services/discovery/JobService'),
		Helper = require('scripts/public/helper'),
		moment = require('scripts/lib/moment'),
		bowser = require('scripts/public/bowser'),
		b = bowser.bowser;

	var session = Helper.getParam("session"),
		jobId = Helper.getParam("jid"); //通过app端查看招聘需要传session

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
		this.namespace = "discoveryJob";
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
					data.recruitment.descriptions = data.recruitment.description ? data.recruitment.description.split(/\r\n/g) : ["无职位介绍"];
					data.recruitment.application=moment(data.recruitment.application).format('MM-DD');
					$(".body").html(template("app/templates/discovery/job/job", data));
				} else throw data;
			}))["catch"](function(error) {
				Helper.errorToast(error);
			}).done(function() {
				Helper.userStatus();
			});
		});
	};
	module.exports = Controller;
});