define(function(require, exports, module) {
	var $ = SUI.$,
		template = require('build/template'),
		loginController = loginController = require('scripts/controllers/loginController');
	exports.init = function(templateName, data) {
		$(".body").append(template(templateName, data || {}));
		(new loginController()).init();
	};
});