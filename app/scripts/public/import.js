define(function(require, exports, module) {
	var $ = require('jquery'),
		template = require('artTemplate'),
		loginController = loginController = require('home/scripts/controllers/loginController');
	exports.init = function(templateName, data) {
		$(".body").append(template(templateName, data || {}));
		(new loginController()).init();
	};
});