define(function(require, exports, module) {
	var $ = SUI.$,
		template = require('build/template'),
		indexController = require('scripts/controllers/indexController'),
		loginController = require('scripts/controllers/loginController');
	require("sui/bootstrap/bootstrap");

	$('.body').html(template('app/templates/index', {}));
	
	(new loginController()).init(function(){
		(new indexController()).init();
	});
	// 轮播图插件
	$(document).on("mouseover","ul.carousel-thumb>li.node",function(){
		$(this).parent().find("li.active").removeClass('active');
		$(this).addClass('active');
		$("ul.carousel-image").find("li:visible").css({display:"none"});
		var index = $(this).attr("index");
		//console.log(index);
		$("ul.carousel-image li").eq(index).css({display:'list-item'});
	});
	$(document).on("click",".nav.nav-org>li:not(.active)",function(){
		var index=$(this).attr("data-index");
		$(this).addClass("active").siblings("li").removeClass("active");
		$(".HotOrg-Img").animate({
			left:(-index)*100+"%"
		},1000);
	});

	try {
		if(window.console && window.console.log) {
			console.log("长期招聘:Web前端开发工程师\n1.熟练掌握Web前端开发基础技术，包括HTML/CSS/JavaScript等\n2.熟悉jQuery或其他前端开发类库的API，有Ember,Angular等前端MVC/MVVM框架使用经验者优先\n3.了解Http协议，有php/Java/Ruby等后台应用开发经验者优先\n4.持续关注前端方面的最新技术和相关主题，有Grunt，Gulp等前端开发工具使用经验者优先\n5.重视团队合作，熟悉一种团队协作开发工具（git/svn等），关注Github等开源社区者优先\n6.有跨浏览器，跨平台客户端开发经验者优先\n7.有责任心，有上进心");
			console.log("请将简历发送至 %c ljj@xiaoxiao.la（ 邮件标题请以“姓名-应聘前端Web-来自console”命名）", "color:red");
		}
	} catch(e) {}
});