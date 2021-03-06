define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		Helper = require('scripts/public/helper'),
		loginController = require('scripts/controllers/loginController');
	var vid;
	var Controller = function(voteId) {
		var _controller = this;
		this.namespace = "sdSingerVote";
		this.actions = {
			goVote: function() {
				var isLogin = AppUser.isLogin;
				// if (isLogin) {
				 	window.location.href = "/vote.html?vid=" + vid;
				// } else {
				// 	Helper.alert("同学你需要登录校校才能投票哦！", {}, function() {
				// 		//window.location.href = "/login.html?go=vote|"+vid;
				// 		window.location.href = "/vote.html?vid=" + vid;
				// 	});
				// }
			}
		};
	};
	bC.extend(Controller);
	Controller.prototype.init = function(voteId, templateName) {
		vid = voteId;
		var _controller = this;
		$(".body").html(template(templateName, {}));
		Helper.eventListener("click", _controller.actions);
		(new loginController()).init(function() {
			Helper.userStatus();
		});
		try {
			if (window.console && window.console.log) {
				console.log("长期招聘:Web前端开发工程师\n1.熟练掌握Web前端开发基础技术，包括HTML/CSS/JavaScript等\n2.熟悉jQuery或其他前端开发类库的API，有Ember,Angular等前端MVC/MVVM框架使用经验者优先\n3.了解Http协议，有php/Java/Ruby等后台应用开发经验者优先\n4.持续关注前端方面的最新技术和相关主题，有Grunt，Gulp等前端开发工具使用经验者优先\n5.重视团队合作，熟悉一种团队协作开发工具（git/svn等），关注Github等开源社区者优先\n6.有跨浏览器，跨平台客户端开发经验者优先\n7.有责任心，有上进心");
				console.log("请将简历发送至 %c ljj@xiaoxiao.la（ 邮件标题请以“姓名-应聘前端Web-来自console”命名）", "color:red");
			}
		} catch (e) {}
	};
	module.exports = Controller;
});