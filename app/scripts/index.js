define(function(require, exports, module) {
	var $ = require('jquery'),
		template = require('artTemplate'),
		indexController = require('scripts/controllers/indexController'),
		loginController = require('scripts/controllers/loginController');
	require("sui/bootstrap/bootstrap");

	$('.body').html(template('app/home/templates/index', {}));
	(new indexController()).init();
	(new loginController()).init();
	// 轮播图插件
	$(document).on("mouseover","ul.carousel-thumb>li.node",function(){
		$(this).parent().find("li.active").removeClass('active');
		$(this).addClass('active');
		$("ul.carousel-image").find("li:visible").css({display:"none"});
		var index = $(this).attr("index");
		console.log(index);
		$("ul.carousel-image li").eq(index).css({display:'list-item'});
	});
});