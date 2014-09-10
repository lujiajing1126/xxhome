define(function(require, exports, module) {

	var $ = SUI.$;
	var template = require('build/template');
	//alert(require('scripts/public/bowser'));
	var bowser = require('scripts/public/bowser');
	var loginController = require('scripts/controllers/loginController');
	
	exports.init = function() {
		var templateName;
		var b = bowser.bowser;

		if (b.android || b.ios || b.wx) {
			templateName = 'app/templates/download_phone';

		} else {
			templateName = 'app/templates/download_pc';
		}
		//templateName = 'app/templates/download_phone';

		$(".body").append(template(templateName, {}));

		//微信不能下载哦亲
		if (b.wx) {
			$(".wx-wrapper").show();
		}
		setTimeout(function() {
			$(".logo").removeClass("out");
		}, 0);
		setTimeout(function() {
			$(".phone-wrapper").removeClass("out");
		}, 500);

		(new loginController()).init();

		try {
			if (window.console && window.console.log) {
				console.log("长期招聘:Web前端开发工程师\n1.熟练掌握Web前端开发基础技术，包括HTML/CSS/JavaScript等\n2.熟悉jQuery或其他前端开发类库的API，有Ember,Angular等前端MVC/MVVM框架使用经验者优先\n3.了解Http协议，有php/Java/Ruby等后台应用开发经验者优先\n4.持续关注前端方面的最新技术和相关主题，有Grunt，Gulp等前端开发工具使用经验者优先\n5.重视团队合作，熟悉一种团队协作开发工具（git/svn等），关注Github等开源社区者优先\n6.有跨浏览器，跨平台客户端开发经验者优先\n7.有责任心，有上进心");
				console.log("请将简历发送至 %c ljj@xiaoxiao.la（ 邮件标题请以“姓名-应聘前端Web-来自console”命名）", "color:red");
			}
		} catch (e) {}
	};
});