define(function(require, exports, module) {
	var $ = SUI.$,
		XX = require('home/js/xx'),
		Login=require('home/js/login');

	XX.popbox();
	XX.requestHotArticles();
	XX.getOrgList();

	$(document).on("click", "[data-xx-action]", function() {
		var fn = $(this).attr("data-xx-action");
		$.isFunction(XX[fn]) && XX[fn].call(this);
	});
	$(document).on("touchstart", "[data-xx-action]", function() {
		var fn = $(this).attr("data-xx-action");
		$.isFunction(XX.actions[fn]) && XX.actions[fn].call(this);
	});
});